const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

// Create S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload file to S3
const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);

    // Return just the filename for database storage
    // The frontend will use getImageUrl() to construct the proper URL
    return fileName;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

// Delete file from S3
const deleteFromS3 = async (fileName) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`Successfully deleted ${fileName} from S3`);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw error;
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
};
