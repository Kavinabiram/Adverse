import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const VideoUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const toast = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check size (1GB max)
            if (selectedFile.size > 1024 * 1024 * 1024) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'File size exceeds 1GB limit', life: 3000 });
                return;
            }

            // Check format
            const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
            if (!validTypes.includes(selectedFile.type)) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Only MP4, MOV, and WEBM formats are supported', life: 3000 });
                return;
            }

            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setThumbnailUrl(null); // Reset thumbnail on new file select
            setProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('video', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/ads/upload-video`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Video uploaded successfully', life: 3000 });
            
            setThumbnailUrl(response.data.thumbnail_url);
            
            if (onUploadSuccess) {
                onUploadSuccess(response.data);
            }

        } catch (error) {
            console.error('Upload error:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Upload Failed', 
                detail: error.response?.data?.message || 'Error uploading video', 
                life: 3000 
            });
            setProgress(0);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white max-w-xl mx-auto">
            <Toast ref={toast} />
            <h2 className="text-xl font-bold mb-4">Upload Video Advertisement</h2>
            
            <div className="mb-4">
                <input 
                    type="file" 
                    accept="video/mp4, video/quicktime, video/webm" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer"
                    disabled={uploading}
                />
                <p className="mt-2 text-xs text-gray-500">Max size: 1GB. Formats: MP4, MOV, WEBM.</p>
            </div>

            {previewUrl && !thumbnailUrl && (
                <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Video Preview:</p>
                    <video src={previewUrl} controls className="w-full rounded-md shadow-sm" style={{ maxHeight: '300px' }} />
                </div>
            )}

            {thumbnailUrl && (
                <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Generated Thumbnail:</p>
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full rounded-md shadow-sm object-cover" style={{ maxHeight: '300px' }} />
                </div>
            )}

            {uploading && (
                <div className="mb-4">
                    <ProgressBar value={progress} className="h-4"></ProgressBar>
                    <p className="text-sm text-center mt-2">{progress}% Uploaded</p>
                </div>
            )}

            <div className="flex justify-end mt-4">
                <Button 
                    label="Upload Video" 
                    icon="pi pi-upload" 
                    onClick={handleUpload} 
                    disabled={!file || uploading} 
                    loading={uploading}
                    className="p-button-primary"
                />
            </div>
        </div>
    );
};

export default VideoUpload;
