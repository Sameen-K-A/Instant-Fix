"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePutPreSignedURL = generatePutPreSignedURL;
exports.generateGetPreSignedURL = generateGetPreSignedURL;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3Client = new client_s3_1.S3Client({
    region: process.env.S3_Region,
    credentials: {
        accessKeyId: process.env.S3_Access_key,
        secretAccessKey: process.env.S3_Secret_key,
    },
});
async function generatePutPreSignedURL(imageName, imageType) {
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.S3_bucketName,
        Key: imageName,
        ContentType: imageType,
    });
    try {
        const url = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 120 });
        return url;
    }
    catch (error) {
        throw error;
    }
    ;
}
;
async function generateGetPreSignedURL(imageName) {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: process.env.S3_bucketName,
        Key: imageName,
    });
    try {
        const url = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 * 24 * 7 });
        return url;
    }
    catch (error) {
        throw error;
    }
    ;
}
;
