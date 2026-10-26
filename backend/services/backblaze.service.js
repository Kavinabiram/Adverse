const B2 = require('backblaze-b2');
const fs = require('fs');

const b2 = new B2({
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY
});

let b2InitPromise = null;

const initializeB2 = async () => {
    if (!b2InitPromise) {
        b2InitPromise = b2.authorize();
    }
    await b2InitPromise;
};

const getB2Token = async () => {
    try {
        // Re-authorize to ensure we have a fresh downloadUrl and token
        await b2.authorize();
        const bucketId = process.env.B2_BUCKET_ID;
        
        const response = await b2.getDownloadAuthorization({
            bucketId: bucketId,
            fileNamePrefix: '', // Authorize everything in the bucket
            validDurationInSeconds: 86400 // 24 hours (safer than 7 days)
        });

        return response.data.authorizationToken;
    } catch (error) {
        console.error('Error getting B2 token:', error);
        throw error;
    }
};

const uploadToB2 = async (filePath, folder, fileName) => {
    try {
        await initializeB2();

        // Get upload URL for the bucket
        const bucketId = process.env.B2_BUCKET_ID;
        const response = await b2.getUploadUrl({
            bucketId: bucketId
        });

        const uploadUrl = response.data.uploadUrl;
        const uploadAuthToken = response.data.authorizationToken;

        const fileData = fs.readFileSync(filePath);
        
        const b2FilePath = `${folder}/${fileName}`;

        const uploadResponse = await b2.uploadFile({
            uploadUrl: uploadUrl,
            uploadAuthToken: uploadAuthToken,
            fileName: b2FilePath,
            data: fileData,
            mime: 'b2/x-auto' // Tells B2 to guess based on extension
        });

        // The authorization object gives the base downloadUrl
        const authData = (await b2InitPromise).data;
        const downloadUrl = authData.downloadUrl;
        
        const bucketResponse = await b2.getBucket({ bucketId: bucketId });
        const bucketName = bucketResponse.data.buckets[0].bucketName;
        
        const encodedBucket = encodeURIComponent(bucketName);
        const encodedPath = b2FilePath.split('/').map(encodeURIComponent).join('/');
        
        // Return URL without token for DB storage, we'll append token dynamically
        const baseUrl = `${downloadUrl}/file/${encodedBucket}/${encodedPath}`;
        
        return {
            fileId: uploadResponse.data.fileId,
            fileName: uploadResponse.data.fileName,
            url: baseUrl
        };
    } catch (error) {
        console.error('B2 Upload Error:', error);
        throw error;
    }
};

module.exports = {
    uploadToB2,
    getB2Token
};
