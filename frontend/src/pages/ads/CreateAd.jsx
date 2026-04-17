import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, Film, Image as ImageIcon, MapPin, Users, Clock, Upload, ChevronRight, ImagePlus } from 'lucide-react';
import api from '../../services/api';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setFormData, formData, setMapModalOpen, setGeocodingLoading }) => {
    const map = useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setGeocodingLoading(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                const data = await response.json();
                
                const location_name = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                const google_maps_url = `https://www.google.com/maps?q=${lat},${lng}`;
                
                setFormData(prev => ({
                    ...prev,
                    location_target: location_name,
                    location_lat: lat,
                    location_lng: lng,
                    google_maps_url: google_maps_url
                }));
                // Short delay so they see the marker drop before parsing
                setTimeout(() => setMapModalOpen(false), 500);
            } catch (err) {
                console.error("Geocoding failed", err);
            } finally {
                setGeocodingLoading(false);
            }
        },
    });

    return formData.location_lat && formData.location_lng ? (
        <Marker position={[formData.location_lat, formData.location_lng]}></Marker>
    ) : null;
};

const CreateAd = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        company_id: '',
        ad_title: '',
        description: '',
        ad_type: 'Video',
        duration: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        website_url: '',
        location_target: '',
        location_lat: null,
        location_lng: null,
        google_maps_url: '',
        age_target: '18-45'
    });
    
    // Upload state
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    // Server states
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');
    const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState('');
    const [videoMetadata, setVideoMetadata] = useState({ size: 0, format: '' });
    
    // Status states
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);

    // Map UI States
    const [mapModalOpen, setMapModalOpen] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data } = await api.get('/companies', { params: { limit: 100 } });
                setCompanies(data.companies);
            } catch (err) {
                console.error('Failed to fetch companies', err);
            }
        };
        fetchCompanies();
        
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, []);

    const handleCompanyChange = (e) => {
        const compId = e.target.value;
        const company = companies.find(c => c.id === compId);
        
        if (company) {
            setFormData(prev => ({
                ...prev,
                company_id: compId,
                contact_name: company.contact_person || '',
                contact_phone: company.phone || '',
                contact_email: company.email || '',
                website_url: company.website || ''
            }));
        } else {
            setFormData(prev => ({ ...prev, company_id: compId }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(selectedFile));

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            if (formData.ad_type === 'Video') {
                const uploadData = new FormData();
                uploadData.append('video', selectedFile);

                const uploadRes = await api.post('/ads/upload-video', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                });

                setUploadedFileUrl(uploadRes.data.file_url);
                setUploadedThumbnailUrl(uploadRes.data.thumbnail_url);
                setVideoMetadata({ size: uploadRes.data.video_size, format: uploadRes.data.video_format });
            } else {
                const uploadData = new FormData();
                uploadData.append('thumbnail', selectedFile);
                const uploadRes = await api.post('/ads/upload-thumbnail', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                });

                setUploadedFileUrl(uploadRes.data.thumbnail_url);
                setUploadedThumbnailUrl(uploadRes.data.thumbnail_url);
                setVideoMetadata({ size: selectedFile.size, format: 'image' });
            }
            setIsUploading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload media');
            setFile(null);
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleCustomThumbnail = async (e) => {
        const thumbFile = e.target.files[0];
        if (!thumbFile) return;

        try {
            const uploadData = new FormData();
            uploadData.append('thumbnail', thumbFile);
            
            const res = await api.post('/ads/upload-thumbnail', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setUploadedThumbnailUrl(res.data.thumbnail_url);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload custom thumbnail');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!uploadedFileUrl) {
            setError('Please wait for the media to finish uploading.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const jsonPayload = {
                ad_company_id: formData.company_id,
                title: formData.ad_title,
                description: formData.description,
                contact_name: formData.contact_name,
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,
                website_url: formData.website_url,
                type: formData.ad_type,
                duration_seconds: parseInt(formData.duration) || 0,
                location_name: formData.location_target,
                location_lat: formData.location_lat,
                location_lng: formData.location_lng,
                google_maps_url: formData.google_maps_url,
                file_url: uploadedFileUrl,
                thumbnail_url: uploadedThumbnailUrl,
                video_size: videoMetadata.size,
                video_format: videoMetadata.format,
                status: 'active'
            };

            await api.post('/ads', jsonPayload);
            navigate('/ads');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create advertisement');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-10">
            <div className="flex items-center space-x-4">
               <NavLink to="/ads" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 group">
                  <ArrowLeft size={20} className="group-hover:text-black dark:group-hover:text-white" />
               </NavLink>
               <div>
                  <h2 className="text-3xl font-black tracking-tight dark:text-white">Create Campaign</h2>
                  <p className="text-gray-400 font-medium">Design and deploy a new advertisement.</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="card space-y-8 dark:bg-black dark:border-zinc-800">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Campaign Title</label>
                            <input
                                type="text"
                                required
                                name="ad_title"
                                value={formData.ad_title}
                                onChange={handleChange}
                                className="input-field dark:bg-zinc-900 border-none"
                                placeholder="e.g. Summer Mega Sale 2026"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field dark:bg-zinc-900 border-none min-h-[100px] resize-y"
                                placeholder="Campaign overview and key objectives..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Company (Auto-Fills Details)</label>
                                <select
                                    required
                                    name="company_id"
                                    value={formData.company_id}
                                    onChange={handleCompanyChange}
                                    className="input-field appearance-none dark:bg-zinc-900 border-none"
                                >
                                    <option value="">Select a company</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name || c.company_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Ad Type</label>
                                <div className="flex p-1 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                                    {['Video', 'Poster'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, ad_type: type })}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${formData.ad_type === type ? 'bg-white dark:bg-zinc-800 shadow text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Contact Name</label>
                                <input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} className="input-field dark:bg-zinc-900 border-none text-sm" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Contact Phone</label>
                                <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="input-field dark:bg-zinc-900 border-none text-sm" placeholder="e.g. +1 555-0192" />
                            </div>
                        </div>

                        {/* Hidden technically, but good for completeness */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <input hidden type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} />
                            </div>
                            <div>
                                <input hidden type="url" name="website_url" value={formData.website_url} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-50 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Target Location</label>
                                <div className="flex space-x-2">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                        <input
                                            type="text"
                                            name="location_target"
                                            value={formData.location_target}
                                            onChange={handleChange}
                                            className="input-field !pl-12 text-sm dark:bg-zinc-900 border-none truncate"
                                            placeholder="Select location using map..."
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setMapModalOpen(true)}
                                        className="btn-secondary !px-4 !py-2 text-xs font-bold shrink-0 bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white rounded-xl transition-all"
                                    >
                                        Map Data
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Age Category</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                    <input
                                        type="text"
                                        name="age_target"
                                        value={formData.age_target}
                                        onChange={handleChange}
                                        className="input-field !pl-12 text-sm dark:bg-zinc-900 border-none"
                                        placeholder="18-35, 25-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Playback Duration (Seconds)</label>
                            <div className="relative w-1/2">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <input
                                    type="number"
                                    name="duration"
                                    required
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="input-field !pl-12 text-sm dark:bg-zinc-900 border-none"
                                    placeholder="e.g. 15"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="card dark:bg-black dark:border-zinc-800">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Upload Creative Assets</label>
                        <div 
                            className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer overflow-hidden relative ${file ? 'border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900' : 'border-gray-200 dark:border-zinc-700 hover:border-gray-400 p-8'}`}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                hidden
                                onChange={handleFileChange}
                                accept={formData.ad_type === 'Video' ? 'video/mp4,video/quicktime,video/webm' : 'image/*'}
                            />
                            {file ? (
                                <div className="space-y-4 flex flex-col items-center">
                                     {previewUrl && (
                                         formData.ad_type === 'Video' ? (
                                             <video src={previewUrl} controls className="w-full h-32 rounded-lg object-contain bg-black z-20" onClick={(e) => e.stopPropagation()} />
                                         ) : (
                                             <img src={previewUrl} alt="Preview" className="w-full h-32 rounded-lg object-cover bg-gray-100" />
                                         )
                                     )}
                                     <div className="w-full text-center mt-2 group relative z-10">
                                        <p className="text-sm font-bold truncate px-2 dark:text-white">{file.name}</p>
                                     </div>
                                </div>
                            ) : (
                                <div className="space-y-2 py-4">
                                     <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                         <Upload size={20} />
                                     </div>
                                     <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">Drag or Click to Drop Media</p>
                                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Max file size: 1GB</p>
                                </div>
                            )}
                        </div>

                        {/* Upload Bar */}
                        {isUploading && (
                           <div className="mt-4 w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                              <div className="bg-black dark:bg-white h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                              <p className="text-[10px] text-center mt-2 font-bold tracking-widest uppercase text-gray-500">Uploading: {uploadProgress}%</p>
                           </div>
                        )}
                        
                        {/* Thumbnail Preview Area */}
                        {!isUploading && uploadedThumbnailUrl && formData.ad_type === 'Video' && (
                            <div className="mt-6 border-t border-gray-100 dark:border-zinc-800 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Thumbnail Preview</label>
                                    <button 
                                        type="button" 
                                        onClick={() => document.getElementById('thumb-upload').click()}
                                        className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 flex items-center gap-1"
                                    >
                                        <ImagePlus size={12} /> Replace
                                    </button>
                                </div>
                                <input
                                    id="thumb-upload"
                                    type="file"
                                    hidden
                                    onChange={handleCustomThumbnail}
                                    accept="image/*"
                                />
                                <div className="relative rounded-lg overflow-hidden border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 group">
                                    <img src={uploadedThumbnailUrl} alt="Thumbnail" className="w-full h-32 object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <span className="text-[10px] font-black uppercase text-white tracking-widest">Active Thumbnail</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading || isUploading}
                            className="w-full btn-primary py-4 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <span>{loading ? 'Committing Database...' : 'Launch Campaign'}</span>
                            {!loading && <ChevronRight size={18} />}
                        </button>
                        <NavLink to="/ads" className="block w-full text-center py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-all">Cancel Event</NavLink>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs rounded-r font-bold">
                            {error}
                        </div>
                    )}
                </div>
            </form>

            {mapModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border border-gray-100 dark:border-zinc-800">
                        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-black">
                            <div>
                                <h3 className="text-lg font-black dark:text-white">Pinpoint Active Location</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">Select an exact map coordinate to link the Campaign marker.</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setMapModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-black dark:text-white transition-all text-xs font-bold"
                            >
                                Close Map
                            </button>
                        </div>
                        {isGeocoding && (
                            <div className="w-full bg-blue-500 text-white text-xs text-center py-1.5 font-bold uppercase tracking-widest animate-pulse">
                                Identifying Node Coordinate...
                            </div>
                        )}
                        <div className="h-[65vh] w-full relative z-0">
                            <MapContainer center={[19.0760, 72.8777]} zoom={11} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker setFormData={setFormData} formData={formData} setMapModalOpen={setMapModalOpen} setGeocodingLoading={setIsGeocoding} />
                            </MapContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateAd;
