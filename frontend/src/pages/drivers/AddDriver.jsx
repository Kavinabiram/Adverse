import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { 
    ArrowLeft, User, Phone, Mail, Car, ChevronRight, 
    FileText, CreditCard, Image as ImageIcon, Upload, X, CheckCircle 
} from 'lucide-react';
import api from '../../services/api';

const AddDriver = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        vehicle_number: '',
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

    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors[e.target.name] || fieldErrors.kyc_numbers) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null, kyc_numbers: null });
        }
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

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setError('Only JPG, PNG and PDF files are allowed.');
                return;
            }

            setFiles(prev => ({ ...prev, [name]: file }));
            setError(null);
            setFieldErrors(prev => ({ ...prev, kyc_docs: null }));

            // Generate Preview (if image)
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            } else {
                setPreviews(prev => ({ ...prev, [name]: 'pdf' })); // Placeholder for PDF
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

        // 1. Grouped Number Validation: Either Aadhaar or License No. must be provided
        if (!formData.aadhaar_number && !formData.license_number) {
            const msg = "Please enter either Aadhaar Number or Driving License Number.";
            setError(msg);
            setFieldErrors({ kyc_numbers: msg });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 2. Grouped Document Validation: At least one of these 3 must be uploaded
        const requiredDocs = ['license_image', 'aadhaar_image', 'vehicle_rc_image'];
        const hasWorkableDoc = requiredDocs.some(f => files[f]);
        
        if (!hasWorkableDoc) {
            const msg = "Please upload at least one KYC document (License, Aadhaar, or Vehicle RC).";
            setError(msg);
            setFieldErrors(prev => ({ ...prev, kyc_docs: msg }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            // Append text fields
            Object.keys(formData).forEach(key => {
                if (formData[key]) data.append(key, formData[key]);
            });
            // Append files (only if they exist)
            Object.keys(files).forEach(key => {
                if (files[key]) data.append(key, files[key]);
            });

            await api.post('/admin/drivers/create', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            navigate('/drivers');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to register driver');
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const FileUploadBox = ({ name, label, icon: Icon }) => (
        <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-600 uppercase tracking-widest px-1">
                {label}
            </label>
            <div className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                previews[name] 
                ? 'border-[#aa3bff] bg-[#aa3bff]/5' 
                : 'border-gray-200 dark:border-zinc-800 hover:border-[#aa3bff]/50 dark:hover:border-[#aa3bff]/50'
            }`}>
                {!previews[name] ? (
                    <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer">
                        <input
                            type="file"
                            name={name}
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center mb-3">
                            <Icon className="text-gray-400" size={20} />
                        </div>
                        <p className="text-xs font-bold text-gray-500 dark:text-zinc-400">Click to upload doc</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">JPG, PNG or PDF up to 5MB</p>
                    </div>
                ) : (
                    <div className="p-2 relative group italic">
                        {previews[name] === 'pdf' ? (
                            <div className="h-40 flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
                                <FileText size={48} className="text-[#aa3bff] mb-2" />
                                <p className="text-xs font-bold text-[#aa3bff]">PDF DOCUMENT</p>
                            </div>
                        ) : (
                            <img 
                                src={previews[name]} 
                                alt={label} 
                                className="h-40 w-full object-cover rounded-lg border border-gray-100 dark:border-zinc-800"
                            />
                        )}
                        <button 
                            type="button"
                            onClick={() => removeFile(name)}
                            className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all transform hover:scale-110"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in slide-in-from-bottom duration-500">
            {/* Header */}
            <div className="flex items-center space-x-4">
               <NavLink to="/drivers" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors dark:text-zinc-400">
                  <ArrowLeft size={20} />
               </NavLink>
               <div>
                  <h2 className="text-3xl font-black tracking-tight dark:text-white transition-colors duration-300">New Driver Registration</h2>
                  <p className="text-gray-400 font-medium text-sm">Onboard a new operator with full KYC documentation.</p>
               </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 text-sm rounded font-bold flex items-center gap-3">
                        <X size={18} className="shrink-0" />
                        {error}
                    </div>
                )}

                {/* Section 1: Basic Information */}
                <div className="card dark:bg-black dark:border-zinc-800 p-6 md:p-8 space-y-8">
                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black italic">B</div>
                        <h3 className="text-lg font-black tracking-tight dark:text-white">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-600 uppercase tracking-widest px-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" required name="name" value={formData.name} onChange={handleTextChange} className="input-field !pl-12 !py-3 !text-sm" placeholder="e.g. John Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-600 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="email" required name="email" value={formData.email} onChange={handleTextChange} className="input-field !pl-12 !py-3 !text-sm" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-600 uppercase tracking-widest px-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" required name="phone" value={formData.phone} onChange={handleTextChange} className="input-field !pl-12 !py-3 !text-sm" placeholder="+91-0000000000" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-600 uppercase tracking-widest px-1">Vehicle License No.</label>
                            <div className="relative">
                                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" required name="vehicle_number" value={formData.vehicle_number} onChange={handleTextChange} className="input-field !pl-12 !py-3 !text-sm" placeholder="KA-01-HG-1234" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: KYC Details */}
                <div className="card dark:bg-black dark:border-zinc-800 p-6 md:p-8 space-y-8">
                    <div className="border-b border-gray-100 dark:border-zinc-800 pb-4 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#aa3bff] text-white flex items-center justify-center font-black italic">K</div>
                            <h3 className="text-lg font-black tracking-tight dark:text-white">KYC Details</h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-400 font-medium mt-1 ml-11">
                            For now, uploading any one KYC document is enough to complete KYC.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-600 uppercase tracking-widest px-1">Aadhaar Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleTextChange} className="input-field !pl-12 !py-3 !text-sm" placeholder="1234 5678 9012" maxLength="12" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-600 uppercase tracking-widest px-1">Driving License No.</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" name="license_number" value={formData.license_number} onChange={handleTextChange} className="input-field !pl-12 !py-3 !text-sm" placeholder="DL-1234567890" />
                            </div>
                        </div>
                    </div>

                    {fieldErrors.kyc_numbers && (
                        <p className="mt-4 text-xs font-bold text-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
                            {fieldErrors.kyc_numbers}
                        </p>
                    )}

                    {/* Document Uploads */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <FileUploadBox name="driver_photo" label="Driver Photo" icon={User} />
                        <FileUploadBox name="license_image" label="License Image" icon={ImageIcon} />
                        <FileUploadBox name="aadhaar_image" label="Aadhaar Image" icon={CreditCard} />
                        <FileUploadBox name="vehicle_rc_image" label="Vehicle RC Image" icon={Car} />
                    </div>

                    {fieldErrors.kyc_docs && (
                        <p className="mt-4 text-xs font-bold text-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
                            {fieldErrors.kyc_docs}
                        </p>
                    )}
                </div>

                {/* Submission */}
                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
                    <div className="hidden md:flex items-center gap-3 text-green-600 dark:text-green-500">
                        <CheckCircle size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">KYC Auto-Verified by Admin</span>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <NavLink to="/drivers" className="flex-1 md:flex-none px-6 py-3 text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white dark:text-zinc-500 text-center">Cancel</NavLink>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 md:flex-none btn-primary !px-10 !py-3.5 flex items-center justify-center space-x-2"
                        >
                            <span>{loading ? 'Processing...' : 'Register Driver'}</span>
                            {!loading && <ChevronRight size={18} />}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddDriver;
