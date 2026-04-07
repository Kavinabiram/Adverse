import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, MapPin, Globe, ChevronRight } from 'lucide-react';

const CreateArea = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        area_name: '',
        latitude: '',
        longitude: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock save logic
        navigate('/areas');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center space-x-4">
               <NavLink to="/areas" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft size={20} />
               </NavLink>
               <div>
                  <h2 className="text-3xl font-black tracking-tight">Define Area</h2>
                  <p className="text-gray-400 font-medium whitespace-nowrap">Create a new geographical targeting zone.</p>
               </div>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Area Name</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                name="area_name"
                                value={formData.area_name}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="e.g. Bandra West, Mumbai"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Latitude</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="18.9212"
                                />
                            </div>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Longitude</label>
                             <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="72.8344"
                                />
                             </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                              <MapPin size={24} className="text-gray-400" />
                              <div>
                                  <p className="text-xs font-black uppercase text-gray-400 tracking-tighter">Geofence Radius</p>
                                  <p className="font-bold">5.0 Kilometers</p>
                              </div>
                         </div>
                         <button type="button" className="text-xs font-bold text-black border-b-2 border-black/10 hover:border-black transition-all">Change</button>
                    </div>

                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-sm px-1">
                       * Advertisements assigned to this area will only trigger check-ins when a vehicle enters the defined radius.
                    </p>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
                        <NavLink to="/areas" className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all">Cancel</NavLink>
                        <button
                            type="submit"
                            className="btn-primary px-10 py-4 flex items-center space-x-2"
                        >
                            <span>Define Area</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateArea;
