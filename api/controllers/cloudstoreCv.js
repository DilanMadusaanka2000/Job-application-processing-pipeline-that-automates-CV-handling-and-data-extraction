require('dotenv').config();
const { Storage } = require('@google-cloud/storage');

// Create a new Storage object with credentials

const projectId = process.env.PROJECT_ID;
const keyFilename = process.env.KEYFILENAME;
const storage = new Storage({ projectId, keyFilename });



// Upload function
async function uploadFile(bucketName, file, fileOutputName) {
    try {
        const bucket = storage.bucket(bucketName);
        const ret = await bucket.upload(file, {
            destination: fileOutputName,
        });

        console.log('File uploaded successfully!');
        return ret;
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

module.exports = { uploadFile };


(async () => {
    const ret = await uploadFile(process.env.BUCKET_NAME);
    console.log(ret);
})();
