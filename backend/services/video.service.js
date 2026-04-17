const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Generate a thumbnail from a video
 * @param {string} inputPath - Path to the input video
 * @param {string} outputFolder - Folder to save the thumbnail
 * @param {string} filename - Filename for the thumbnail
 * @returns {Promise<string>} - Resolves with the path to the thumbnail
 */
const generateThumbnail = (inputPath, outputFolder, filename) => {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(outputFolder, filename);

        // Ensure output folder exists
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }
        
        ffmpeg(inputPath)
            .screenshots({
                timestamps: ['00:00:00.500'], // Half a second in, safer for very short clips
                filename: filename,
                folder: outputFolder,
                size: '?x720' // Scale to max 720p height, preserving aspect ratio
            })
            .on('end', () => {
                // Wait a tiny bit just to ensure file descriptor is released
                setTimeout(() => resolve(outputPath), 100);
            })
            .on('error', (err) => {
                console.error('Error generating thumbnail:', err);
                reject(err);
            });
    });
};

module.exports = {
    generateThumbnail
};
