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

        // Generate a signed authorization token because FREE Backblaze accounts 
        // lock buckets to Private natively and return 401 Unauthorized
        const authReq = await b2.getDownloadAuthorization({
            bucketId: bucketId,
            fileNamePrefix: '',
            validDurationInSeconds: 604800 // 7 days Max limit
        });
        const urlAuthToken = authReq.data.authorizationToken;

        // The authorization object gives the base downloadUrl
        const authData = (await b2InitPromise).data;
        const downloadUrl = authData.downloadUrl;
        
        // We know that getting bucket Name is critical for public URLs
        const bucketResponse = await b2.getBucket({ bucketId: bucketId });
        const bucketName = bucketResponse.data.buckets[0].bucketName;
        
        // Correcting URL structure parsing for special characters or spaces
        const encodedBucket = encodeURIComponent(bucketName);
        const encodedPath = b2FilePath.split('/').map(encodeURIComponent).join('/');
        
        // Append the token to forcefully bypass the private rendering lock
        const publicUrl = `${downloadUrl}/file/${encodedBucket}/${encodedPath}?Authorization=${urlAuthToken}`;
        
        return {
            fileId: uploadResponse.data.fileId,
            fileName: uploadResponse.data.fileName,
            url: publicUrl
        };
    } catch (error) {
        console.error('B2 Upload Error:', error);
        throw error;
    }
};

module.exports = {
    uploadToB2
};
