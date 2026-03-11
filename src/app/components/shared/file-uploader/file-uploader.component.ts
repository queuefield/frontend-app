import {
  Component,
  input,
  output,
  signal,
  inject,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService, FileUploadPayload } from '../../../services/file-upload.service';

/** Status of each file in the upload queue */
export type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

export interface UploadFileItem {
  file: File;
  fileName: string;
  fileSize: number;
  contentType: string;
  status: FileStatus;
  progress: number;
  uploadedBytes: number;
  guid: string | null;
  errorMessage: string | null;
}

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ── Inputs ──
  /** Header label displayed above the upload zone */
  readonly header = input<string>('Upload');
  /** File category sent in the API payload */
  readonly category = input<string>('general');
  /** Whether to allow multiple files */
  readonly multiple = input<boolean>(false);
  /** Accepted file extensions (e.g. ['.pdf', '.png']). Empty = all */
  readonly acceptedExtensions = input<string[]>([]);
  /** Maximum number of files (default 5) */
  readonly maxFiles = input<number>(5);
  /** Maximum file size in MB (default 10) */
  readonly maxFileSize = input<number>(10);
  /** Hint text shown below the upload icon */
  readonly hint = input<string>('');
  /** Pre-existing file GUIDs (for edit mode) */
  readonly existingFiles = input<string[]>([]);

  // ── Outputs ──
  /** Emits the list of successfully uploaded GUIDs whenever it changes */
  readonly filesUploaded = output<string[]>();
  /** Emits when a file is deleted */
  readonly fileDeleted = output<string>();

  // ── State ──
  files = signal<UploadFileItem[]>([]);
  isDragOver = signal(false);
  validationError = signal<string | null>(null);

  private uploadService = inject(FileUploadService);

  // ── Computed helpers ──
  get acceptString(): string {
    const exts = this.acceptedExtensions();
    return exts.length > 0 ? exts.join(',') : '*';
  }

  get extensionHint(): string {
    const exts = this.acceptedExtensions();
    if (exts.length > 0) {
      return exts.map((e) => e.replace('.', '').toUpperCase()).join(', ');
    }
    return 'All file types';
  }

  get maxSizeFormatted(): string {
    return `${this.maxFileSize()}MB`;
  }

  get successfulGuids(): string[] {
    return this.files()
      .filter((f) => f.status === 'success' && f.guid)
      .map((f) => f.guid!);
  }

  // ── Drag & Drop ──
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles) {
      this.handleFiles(Array.from(droppedFiles));
    }
  }

  // ── File Input ──
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
      // Reset input so same file can be re-selected
      input.value = '';
    }
  }

  openFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  // ── File Processing ──
  private handleFiles(newFiles: File[]): void {
    this.validationError.set(null);

    const currentFiles = this.files();
    const maxFiles = this.multiple() ? this.maxFiles() : 1;
    const maxSize = this.maxFileSize() * 1024 * 1024; // Convert to bytes
    const accepted = this.acceptedExtensions();

    // Single mode: replace existing files and upload via single API
    if (!this.multiple()) {
      if (newFiles.length > 0) {
        const file = newFiles[0];
        if (accepted.length > 0 && !this.isExtensionAllowed(file.name, accepted)) {
          this.validationError.set(`File type not allowed. Accepted: ${this.extensionHint}`);
          return;
        }
        if (file.size > maxSize) {
          this.validationError.set(`File exceeds maximum size of ${this.maxSizeFormatted}`);
          return;
        }
        this.files.set([]);
        this.uploadSingleFile(file);
      }
      return;
    }

    // Multiple mode: validate all first, then batch upload
    const totalAfter = currentFiles.length + newFiles.length;
    if (totalAfter > maxFiles) {
      this.validationError.set(
        `Maximum ${maxFiles} files allowed. You already have ${currentFiles.length}.`
      );
      return;
    }

    const validFiles: File[] = [];
    for (const file of newFiles) {
      if (accepted.length > 0 && !this.isExtensionAllowed(file.name, accepted)) {
        this.validationError.set(`"${file.name}" type not allowed. Accepted: ${this.extensionHint}`);
        continue;
      }
      if (file.size > maxSize) {
        this.validationError.set(`"${file.name}" exceeds maximum size of ${this.maxSizeFormatted}`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      this.uploadMultipleFiles(validFiles);
    }
  }

  private isExtensionAllowed(fileName: string, accepted: string[]): boolean {
    const ext = '.' + fileName.split('.').pop()?.toLowerCase();
    return accepted.some(
      (a) => a.toLowerCase() === ext || a.toLowerCase() === ext.replace('.', '')
    );
  }

  // ── Single File Upload (single mode + retry) ──
  private async uploadSingleFile(file: File): Promise<void> {
    const item: UploadFileItem = {
      file,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type || 'application/octet-stream',
      status: 'uploading',
      progress: 0,
      uploadedBytes: 0,
      guid: null,
      errorMessage: null,
    };

    this.files.update((list) => [...list, item]);
    const index = this.files().length - 1;
    const progressInterval = this.simulateProgress(index);

    try {
      const base64 = await this.uploadService.fileToBase64(file);
      const payload: FileUploadPayload = {
        fileName: file.name,
        base64Content: base64,
        contentType: file.type || 'application/octet-stream',
        category: this.category(),
      };

      this.uploadService.uploadSingle(payload).subscribe({
        next: (res: any) => {
          clearInterval(progressInterval);
          const guid = this.extractGuid(res);
          this.updateFileItem(index, {
            status: 'success',
            progress: 100,
            uploadedBytes: file.size,
            guid,
          });
          this.emitGuids();
        },
        error: (err: any) => {
          clearInterval(progressInterval);
          this.updateFileItem(index, {
            status: 'error',
            progress: 0,
            uploadedBytes: 0,
            errorMessage: err?.message || 'Upload failed',
          });
        },
      });
    } catch (err: any) {
      clearInterval(progressInterval);
      this.updateFileItem(index, {
        status: 'error',
        progress: 0,
        uploadedBytes: 0,
        errorMessage: err?.message || 'Failed to read file',
      });
    }
  }

  // ── Multiple Files Upload (batch via upload-multiple API) ──
  private async uploadMultipleFiles(files: File[]): Promise<void> {
    // Add all files to the UI in "uploading" state
    const startIndex = this.files().length;
    const progressIntervals: any[] = [];

    for (const file of files) {
      const item: UploadFileItem = {
        file,
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type || 'application/octet-stream',
        status: 'uploading',
        progress: 0,
        uploadedBytes: 0,
        guid: null,
        errorMessage: null,
      };
      this.files.update((list) => [...list, item]);
    }

    // Start progress simulation for all new files
    for (let i = 0; i < files.length; i++) {
      progressIntervals.push(this.simulateProgress(startIndex + i));
    }

    try {
      // Convert all files to base64 in parallel
      const base64Results = await Promise.all(
        files.map((f) => this.uploadService.fileToBase64(f))
      );

      // Build the batch payload
      const filePayloads: FileUploadPayload[] = files.map((file, i) => ({
        fileName: file.name,
        base64Content: base64Results[i],
        contentType: file.type || 'application/octet-stream',
        category: this.category(),
      }));

      const batchPayload = {
        files: filePayloads,
        category: this.category(),
      };

      this.uploadService.uploadMultiple(batchPayload).subscribe({
        next: (res: any) => {
          // Stop all progress simulations
          progressIntervals.forEach((iv) => clearInterval(iv));

          // Extract GUIDs from response — handle various response shapes
          const guids = this.extractGuids(res, files.length);

          // Update each file item with its corresponding GUID
          for (let i = 0; i < files.length; i++) {
            this.updateFileItem(startIndex + i, {
              status: 'success',
              progress: 100,
              uploadedBytes: files[i].size,
              guid: guids[i] || null,
            });
          }
          this.emitGuids();
        },
        error: (err: any) => {
          // Mark all files as failed
          progressIntervals.forEach((iv) => clearInterval(iv));
          for (let i = 0; i < files.length; i++) {
            this.updateFileItem(startIndex + i, {
              status: 'error',
              progress: 0,
              uploadedBytes: 0,
              errorMessage: err?.message || 'Upload failed',
            });
          }
        },
      });
    } catch (err: any) {
      progressIntervals.forEach((iv) => clearInterval(iv));
      for (let i = 0; i < files.length; i++) {
        this.updateFileItem(startIndex + i, {
          status: 'error',
          progress: 0,
          uploadedBytes: 0,
          errorMessage: err?.message || 'Failed to read files',
        });
      }
    }
  }

  private extractGuid(res: any): string {
    const guid = res?.data?.id || res?.data || res?.id || res;
    return typeof guid === 'string' ? guid : JSON.stringify(guid);
  }

  private extractGuids(res: any, count: number): string[] {
    // Try common response shapes
    const list = res?.data || res?.ids || res?.files || res;
    if (Array.isArray(list)) {
      return list.map((item: any) => {
        if (typeof item === 'string') return item;
        return item?.id || item?.data || JSON.stringify(item);
      });
    }
    // Fallback: if single guid returned, replicate
    const single = this.extractGuid(res);
    return new Array(count).fill(single);
  }

  private simulateProgress(index: number): any {
    let progress = 0;
    return setInterval(() => {
      progress = Math.min(progress + Math.random() * 15, 90);
      this.updateFileItem(index, {
        progress: Math.round(progress),
        uploadedBytes: Math.round((progress / 100) * this.files()[index]?.fileSize || 0),
      });
    }, 200);
  }

  private updateFileItem(index: number, updates: Partial<UploadFileItem>): void {
    this.files.update((list) => {
      const copy = [...list];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updates };
      }
      return copy;
    });
  }

  // ── Retry ──
  retryUpload(index: number): void {
    const item = this.files()[index];
    if (!item) return;

    this.updateFileItem(index, {
      status: 'uploading',
      progress: 0,
      uploadedBytes: 0,
      errorMessage: null,
    });

    const progressInterval = this.simulateProgress(index);

    this.uploadService.fileToBase64(item.file).then((base64) => {
      const payload: FileUploadPayload = {
        fileName: item.fileName,
        base64Content: base64,
        contentType: item.contentType,
        category: this.category(),
      };

      this.uploadService.uploadSingle(payload).subscribe({
        next: (res: any) => {
          clearInterval(progressInterval);
          const guid = res?.data?.id || res?.data || res?.id || res;
          this.updateFileItem(index, {
            status: 'success',
            progress: 100,
            uploadedBytes: item.fileSize,
            guid: typeof guid === 'string' ? guid : JSON.stringify(guid),
          });
          this.emitGuids();
        },
        error: (err: any) => {
          clearInterval(progressInterval);
          this.updateFileItem(index, {
            status: 'error',
            progress: 0,
            uploadedBytes: 0,
            errorMessage: err?.message || 'Upload failed',
          });
        },
      });
    }).catch((err) => {
      clearInterval(progressInterval);
      this.updateFileItem(index, {
        status: 'error',
        progress: 0,
        uploadedBytes: 0,
        errorMessage: err?.message || 'Failed to read file',
      });
    });
  }

  // ── Delete ──
  deleteFile(index: number): void {
    const item = this.files()[index];
    if (!item) return;

    if (item.guid) {
      // Delete from server
      this.uploadService.deleteFile(item.guid).subscribe({
        next: () => {
          this.fileDeleted.emit(item.guid!);
          this.removeFile(index);
        },
        error: () => {
          // Still remove from UI
          this.removeFile(index);
        },
      });
    } else {
      this.removeFile(index);
    }
  }

  private removeFile(index: number): void {
    this.files.update((list) => list.filter((_, i) => i !== index));
    this.emitGuids();
  }

  private emitGuids(): void {
    this.filesUploaded.emit(this.successfulGuids);
  }

  // ── Utilities ──
  hasAnyError(): boolean {
    return this.files().some((f) => f.status === 'error');
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(bytes < 1024 ? 0 : 0)} ${units[i]}`;
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const iconMap: Record<string, string> = {
      pdf: 'pdf',
      doc: 'word',
      docx: 'word',
      xls: 'excel',
      xlsx: 'excel',
      ppt: 'ppt',
      pptx: 'ppt',
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image',
      svg: 'image',
      webp: 'image',
      mp4: 'video',
      mov: 'video',
      avi: 'video',
      zip: 'archive',
      rar: 'archive',
      '7z': 'archive',
      txt: 'text',
      csv: 'text',
    };
    return iconMap[ext] || 'file';
  }
}
