import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const ThumbnailUpdate = ({ adId, currentThumbnailUrl, onUpdateSuccess }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const toast = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(selectedFile.type)) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Only JPG and PNG formats are supported', life: 3000 });
                return;
            }

            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!file || !adId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('thumbnail', file);
        formData.append('id', adId);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/ads/update-thumbnail`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Thumbnail updated successfully', life: 3000 });
            
            if (onUpdateSuccess) {
                onUpdateSuccess(response.data.ad);
            }

        } catch (error) {
            console.error('Upload error:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Update Failed', 
                detail: error.response?.data?.message || 'Error updating thumbnail', 
                life: 3000 
            });
            setProgress(0);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white max-w-sm mx-auto">
            <Toast ref={toast} />
            <h3 className="text-lg font-semibold mb-3">Update Custom Thumbnail</h3>
            
            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Current/New Thumbnail:</p>
                {(previewUrl || currentThumbnailUrl) ? (
                    <img 
                        src={previewUrl || currentThumbnailUrl} 
                        alt="Thumbnail preview" 
                        className="w-full h-40 object-cover rounded shadow-sm border" 
                    />
                ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 rounded border border-dashed">
                        No Preview Available
                    </div>
                )}
            </div>

            <div className="mb-4">
                <input 
                    type="file" 
                    accept="image/jpeg, image/jpg, image/png" 
                    onChange={handleFileChange}
                    className="block w-full text-xs text-gray-500
                        file:mr-4 file:py-1 file:px-3
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 cursor-pointer"
                    disabled={uploading}
                />
            </div>

            {uploading && (
                <div className="mb-4">
                    <ProgressBar value={progress} className="h-2"></ProgressBar>
                </div>
            )}

            <Button 
                label="Replace Thumbnail" 
                icon="pi pi-image" 
                onClick={handleUpload} 
                disabled={!file || uploading} 
                loading={uploading}
                className="p-button-sm p-button-outlined w-full"
            />
        </div>
    );
};

export default ThumbnailUpdate;
