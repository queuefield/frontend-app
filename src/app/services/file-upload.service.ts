import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface FileUploadPayload {
  fileName: string;
  base64Content: string;
  contentType: string;
  category: string;
}

export interface MultipleFileUploadPayload {
  files: FileUploadPayload[];
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private http = inject(HttpService);

  private readonly UPLOAD_SINGLE = '/api/v1/customer/file/upload';
  private readonly UPLOAD_MULTIPLE = '/api/v1/customer/file/upload-multiple';
  private readonly DELETE_FILE = '/api/v1/customer/file';

  /**
   * Upload a single file. Returns a GUID on success.
   */
  uploadSingle(payload: FileUploadPayload): Observable<any> {
    return this.http.post(this.UPLOAD_SINGLE, payload);
  }

  /**
   * Upload multiple files. Returns an array of GUIDs on success.
   */
  uploadMultiple(payload: MultipleFileUploadPayload): Observable<any> {
    return this.http.post(this.UPLOAD_MULTIPLE, payload);
  }

  /**
   * Delete a file by its GUID.
   */
  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.DELETE_FILE}/${fileId}`);
  }

  /**
   * Convert a File to a base64 string.
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:...;base64, prefix
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
