import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, UploadStream } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private cloudinary: {
      uploader: {
        upload_stream: (
          options: { folder: string },
          callback: (error: any, result: UploadApiResponse) => void,
        ) => UploadStream;
      };
    },
  ) {}

  // Upload a single image
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error('Invalid file or file buffer not found');
    }

    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder },
        (error: any, result: UploadApiResponse) => {
          if (error) {
            reject(new Error('Image upload failed'));
          } else {
            resolve(result.secure_url);
          }
        },
      );

      stream.end(file.buffer);
    });
  }

  // Upload multiple images
  async uploadImages(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload');
    }

    // Map through files and upload them one by one
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));

    return Promise.all(uploadPromises); // Resolve all upload promises
  }
}
