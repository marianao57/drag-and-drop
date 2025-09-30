import { Injectable } from '@angular/core';
import { CONFIG_URLS } from '../constants/urls.constants';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  constructor() {}

  async uploadDocument(fileData: {
    originalName: string;
    file: File;
  }): Promise<{
    responseMetadata: any;
    data: {
      document_uuid: string;
      key: string;
      bucket: string;
      upload_url: string;
    };
  }> {
    const requestData = {
      filename: fileData.originalName,
      content_type: fileData.file.type || 'application/octet-stream',
    };
    try {
      const response = await fetch(CONFIG_URLS.UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': CONFIG_URLS.API_KEY,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Upload API failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const uploadURL = data.data.upload_url;

      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: fileData.file,
        headers: {
          'Content-Type': fileData.file.type || 'application/octet-stream',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 upload failed: ${uploadResponse.status}`);
      }
      return data;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as any).message === 'string'
      ) {
        if ((error as any).message.includes('Failed to fetch')) {
          throw new Error(
            'Network error: Check if API is accessible and CORS is configured'
          );
        }
      }
      throw error;
    }
  }

  async processFile({
    document_uuid,
    key,
    bucket,
  }: {
    document_uuid: string;
    key: string;
    bucket: string;
  }): Promise<any> {
    try {
      const processData = {
        document_uuid,
        key,
        bucket,
      };

      const response = await fetch(CONFIG_URLS.PROCESS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': CONFIG_URLS.API_KEY,
        },
        body: JSON.stringify(processData),
      });

      if (!response.ok) {
        throw new Error(`Process API failed: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error subiendo archivo:', error);
    }
  }

  async getDownloadUrl(processData: any): Promise<any> {
    const downloadData = {
      processed_key: processData.processed_key,
      bucket: processData.bucket,
    };

    const response = await fetch(CONFIG_URLS.DOWNLOAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG_URLS.API_KEY,
      },
      body: JSON.stringify(downloadData),
    });

    if (!response.ok) {
      throw new Error(`Download API failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }
}
