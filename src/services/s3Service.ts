
import AWS from 'aws-sdk';

// Polyfill global for AWS SDK
if (typeof window !== 'undefined' && !window.global) {
  (window as any).global = window;
}

// AWS S3 Configuration
const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-key',
  region: process.env.AWS_REGION || 'eu-west-1',
  bucketName: process.env.AWS_S3_BUCKET || 'your-bucket-name',
};

// Initialize S3 client
const s3 = new AWS.S3({
  accessKeyId: s3Config.accessKeyId,
  secretAccessKey: s3Config.secretAccessKey,
  region: s3Config.region,
});

/**
 * Upload a file to Amazon S3
 * @param file The file to upload
 * @param directory Optional directory path inside the bucket
 * @returns The URL of the uploaded file
 */
export const uploadFileToS3 = async (file: File, directory: string = 'applications'): Promise<string> => {
  try {
    // Create a unique file path with timestamp and UUID
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._]/g, '_');
    const uniqueFilePath = `${directory}/${timestamp}-${safeFilename}`;

    console.log(`Starting S3 upload for file: ${uniqueFilePath}`);

    // Upload the file to S3
    const fileBuffer = await file.arrayBuffer();
    const params = {
      Bucket: s3Config.bucketName,
      Key: uniqueFilePath,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      ACL: 'public-read', // Make the file publicly accessible
    };

    const result = await s3.upload(params).promise();
    console.log('File uploaded successfully to S3:', result.Location);
    return result.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a file from Amazon S3
 * @param fileUrl The URL of the file to delete
 */
export const deleteFileFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    // Extract the key from the file URL
    const urlParts = fileUrl.split('/');
    const key = urlParts.slice(3).join('/');

    const params = {
      Bucket: s3Config.bucketName,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    console.log('File deleted successfully from S3:', fileUrl);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Check if AWS S3 is configured properly
 */
export const checkS3Configuration = (): boolean => {
  const isConfigured = 
    s3Config.accessKeyId !== 'your-access-key' &&
    s3Config.secretAccessKey !== 'your-secret-key' &&
    s3Config.bucketName !== 'your-bucket-name';
  
  console.log('S3 configuration check:', isConfigured ? 'configured' : 'not configured');
  return isConfigured;
};
