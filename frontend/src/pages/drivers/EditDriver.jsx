import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { 
    User, Phone, Mail, Car, ArrowLeft, Save, Trash2,
    FileText, CreditCard, Image as ImageIcon, X, CheckCircle, ChevronRight,
    Lock, Eye, EyeOff, ShieldCheck
} from 'lucide-react';
import api from '../../services/api';

const EditDriver = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [resettingPassword, setResettingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        vehicle_number: '',
        status: 'ACTIVE',
        aadhaar_number: '',
        license_number: ''
    });

    const [files, setFiles] = useState({
        license_image: null,
        aadhaar_image: null,
        driver_photo: null,
        vehicle_rc_image: null
    });

    const [previews, setPreviews] = useState({
        license_image: '',
        aadhaar_image: '',
        driver_photo: '',
        vehicle_rc_image: ''
    });

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const { data } = await api.get(`/drivers/${id}`);
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    vehicle_number: data.vehicle_number || data.auto_number,
                    status: data.status || 'ACTIVE',
                    aadhaar_number: data.aadhaar_number || '',
                    license_number: data.license_number || ''
                });

                // Set existing previews
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                setPreviews({
                    license_image: data.license_image ? `${baseUrl}${data.license_image}` : '',
                    aadhaar_image: data.aadhaar_image ? `${baseUrl}${data.aadhaar_image}` : '',
                    driver_photo: data.driver_photo ? `${baseUrl}${data.driver_photo}` : '',
                    vehicle_rc_image: data.vehicle_rc_image ? `${baseUrl}${data.vehicle_rc_image}` : ''
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching driver', error);
                setLoading(false);
            }
        };
        fetchDriver();
    }, [id]);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors.kyc_numbers) setFieldErrors({ ...fieldErrors, kyc_numbers: null });
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        const file = selectedFiles[0];

        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError(`${name.replace('_', ' ')} is too large. Max 5MB allowed.`);
                return;
            }

            setFiles(prev => ({ ...prev, [name]: file }));
            setError(null);
            setFieldErrors(prev => ({ ...prev, kyc_docs: null }));

            // Generate Preview
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            } else {
                setPreviews(prev => ({ ...prev, [name]: 'pdf' }));
            }
        }
    };

    const removeFile = (name) => {
        setFiles(prev => ({ ...prev, [name]: null }));
        setPreviews(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        // Grouped Validation
        if (!formData.aadhaar_number && !formData.license_number) {
            const msg = "Please enter either Aadhaar Number or Driving License Number.";
            setError(msg);
            setFieldErrors({ kyc_numbers: msg });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const hasWorkableDoc = ['license_image', 'aadhaar_image', 'vehicle_rc_image'].some(f => files[f] || previews[f]);
        if (!hasWorkableDoc) {
            const msg = "Please upload at least one KYC document (License, Aadhaar, or Vehicle RC).";
            setError(msg);
            setFieldErrors(prev => ({ ...prev, kyc_docs: msg }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setSaving(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            Object.keys(files).forEach(key => {
                if (files[key]) data.append(key, files[key]);
            });

            await api.put(`/admin/drivers/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/drivers');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update driver');
            setSaving(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setResettingPassword(true);
        setError(null);
        try {
            await api.post(`/admin/drivers/${id}/reset-password`, { password: newPassword });
            setResetSuccess(true);
            setNewPassword('');
            setTimeout(() => setResetSuccess(false), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setResettingPassword(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to remove this driver permanently?')) {
            try {
                await api.delete(`/drivers/${id}`);
                navigate('/drivers');
            } catch (error) {
                console.error('Failed to delete driver', error);
            }
        }
    };

    const FileUploadBox = ({ name, label, icon: Icon }) => (
        <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-600 uppercase tracking-widest px-1">
                {label}
            </label>
            <div className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                previews[name] 
                ? 'border-[#aa3bff] bg-[#aa3bff]/5' 
                : 'border-gray-200 dark:border-zinc-800 hover:border-[#aa3bff]/50 dark:hover:border-[#aa3bff]/50'
            }`}>
                {!previews[name] ? (
                    <div className="p-6 flex flex-col items-center justify-center text-center cursor-pointer">
                        <input
                            type="file"
                            name={name}
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center mb-2">
                            <Icon className="text-gray-400" size={18} />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Upload Doc</p>
                    </div>
                ) : (
                    <div className="p-2 relative group italic">
                        {previews[name] === 'pdf' ? (
                            <div className="h-32 flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 rounded-lg">
                                <FileText size={40} className="text-[#aa3bff] mb-1" />
                                <p className="text-[10px] font-bold text-[#aa3bff]">PDF</p>
                            </div>
                        ) : (
                            <img 
                                src={previews[name]} 
                                alt={label} 
                                className="h-32 w-full object-cover rounded-lg border border-gray-100 dark:border-zinc-800"
                            />
                        )}
                        <button 
                            type="button"
                            onClick={() => removeFile(name)}
                            className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Establishing secure connection...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <NavLink to="/drivers" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group text-gray-400">
                        <ArrowLeft size={20} />
                    </NavLink>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight dark:text-white transition-colors duration-300">Update Profile</h2>
                        <p className="text-gray-400 font-medium mt-1">Modify driver details or credentials.</p>
                    </div>
                </div>
                <button 
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-red-500 border border-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                    <span>Terminate ID</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 text-sm rounded font-bold flex items-center gap-3">
                        <X size={18} className="shrink-0" />
                        {error}
                    </div>
                )}

                {/* Section 1: Basic Information */}
                <div className="card dark:bg-black dark:border-zinc-800 p-6 md:p-8 space-y-8">
                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
                        <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black italic">B</div>
                        <h3 className="text-lg font-black tracking-tight dark:text-white">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Full Identity Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" required name="name" value={formData.name} onChange={handleTextChange} className="input-field !pl-12 !py-2.5 dark:bg-zinc-900" placeholder="e.g. Johnathan Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="email" required name="email" value={formData.email} onChange={handleTextChange} className="input-field !pl-12 !py-2.5 dark:bg-zinc-900" placeholder="john@example.com" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Contact Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" required name="phone" value={formData.phone} onChange={handleTextChange} className="input-field !pl-12 !py-2.5 dark:bg-zinc-900" placeholder="+91 99999999" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Vehicle Registration ID</label>
                            <div className="relative">
                                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" required name="vehicle_number" value={formData.vehicle_number} onChange={handleTextChange} className="input-field !pl-12 !py-2.5 dark:bg-zinc-900" placeholder="MH-01-XX-1234" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Active Status</label>
                        <select name="status" value={formData.status} onChange={handleTextChange} className="input-field !py-2.5 dark:bg-zinc-900">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Section 2: Security & Access (Reset Password) */}
                <div className="card dark:bg-black dark:border-zinc-800 p-6 md:p-8 space-y-8 border-l-4 border-l-[#aa3bff]">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#aa3bff] text-white flex items-center justify-center font-black italic">S</div>
                            <h3 className="text-lg font-black tracking-tight dark:text-white">Security & Access</h3>
                        </div>
                        {resetSuccess && (
                            <div className="flex items-center gap-2 text-green-500 text-xs font-bold animate-in fade-in slide-in-from-right-2">
                                <CheckCircle size={14} />
                                <span>PASSWORD UPDATED</span>
                            </div>
                        )}
                    </div>

                    <div className="max-w-md space-y-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Overwrite Account Password</label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    className="input-field !pl-12 !pr-12 !py-2.5 dark:bg-zinc-900" 
                                    placeholder="Enter new password" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                disabled={resettingPassword || !newPassword}
                                className="px-6 py-2.5 bg-[#aa3bff] hover:bg-[#aa3bff]/80 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                            >
                                <ShieldCheck size={16} />
                                {resettingPassword ? 'Processing...' : 'Reset'}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium px-1">This will immediately overwrite the driver's current password. They will need to use the new password for their next login.</p>
                    </div>
                </div>

                {/* Section 3: KYC Details */}
                <div className="card dark:bg-black dark:border-zinc-800 p-6 md:p-8 space-y-8">
                    <div className="border-b border-gray-100 dark:border-zinc-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#aa3bff] text-white flex items-center justify-center font-black italic">K</div>
                            <h3 className="text-lg font-black tracking-tight dark:text-white">KYC Details</h3>
                        </div>
                        <p className="text-xs text-gray-400 font-medium mt-1 ml-11">
                            For now, uploading any one KYC document is enough to complete KYC.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Aadhaar Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleTextChange} className="input-field !pl-12 !py-2.5 dark:bg-zinc-900" placeholder="1234 5678 9012" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Driving License No.</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" name="license_number" value={formData.license_number} onChange={handleTextChange} className="input-field !pl-12 !py-2.5 dark:bg-zinc-900" placeholder="DL-1234567890" />
                            </div>
                        </div>
                    </div>

                    {fieldErrors.kyc_numbers && (
                        <p className="text-xs font-bold text-red-500 px-1">{fieldErrors.kyc_numbers}</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                        <FileUploadBox name="driver_photo" label="Driver Photo" icon={User} />
                        <FileUploadBox name="license_image" label="License Image" icon={ImageIcon} />
                        <FileUploadBox name="aadhaar_image" label="Aadhaar Image" icon={CreditCard} />
                        <FileUploadBox name="vehicle_rc_image" label="Vehicle RC Image" icon={Car} />
                    </div>

                    {fieldErrors.kyc_docs && (
                        <p className="text-xs font-bold text-red-500 px-1">{fieldErrors.kyc_docs}</p>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
                    <div className="hidden md:flex items-center gap-3 text-green-600">
                        <CheckCircle size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Admin Authorized Edit</span>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button type="button" onClick={() => navigate('/drivers')} className="flex-1 md:flex-none px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-widest">Discard</button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 md:flex-none btn-primary !px-10 !py-3 flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Save size={16} />
                            <span className="font-bold uppercase tracking-widest text-xs">{saving ? 'Saving...' : 'Save Profile'}</span>
                            {!saving && <ChevronRight size={16} />}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditDriver;
