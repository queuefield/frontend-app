# File Uploader Component

A generic, reusable file uploader with drag-and-drop, progress tracking, retry on failure, and delete support.

## Selector

```html
<app-file-uploader />
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `header` | `string` | `'Upload'` | Label displayed above the drop zone |
| `category` | `string` | `'general'` | Category string sent in the API payload |
| `multiple` | `boolean` | `false` | Allow multiple file uploads |
| `acceptedExtensions` | `string[]` | `[]` (all) | Restrict file types, e.g. `['.pdf', '.png']` |
| `maxFiles` | `number` | `5` | Max number of files (multiple mode) |
| `maxFileSize` | `number` | `10` | Max file size in MB |
| `hint` | `string` | `''` | Custom hint text below the upload icon |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `filesUploaded` | `string[]` | Emits the list of uploaded GUIDs whenever it changes |
| `fileDeleted` | `string` | Emits the GUID of a deleted file |

## API Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Upload single | POST | `/api/v1/customer/file/upload` |
| Upload multiple | POST | `/api/v1/customer/file/upload-multiple` |
| Delete file | DELETE | `/api/v1/customer/file/{id}` |

## Usage Examples

### Single File Upload

```html
<app-file-uploader
  header="Contract Document"
  category="contract"
  [acceptedExtensions]="['.pdf', '.doc', '.docx']"
  [maxFileSize]="5"
  (filesUploaded)="onFileUploaded($event)"
/>
```

```typescript
onFileUploaded(guids: string[]): void {
  this.contractFileId = guids[0]; // Single file returns one GUID
}
```

### Multiple File Upload

```html
<app-file-uploader
  header="Legal Documents"
  category="legal"
  [multiple]="true"
  [maxFiles]="10"
  [maxFileSize]="20"
  [acceptedExtensions]="['.pdf', '.jpg', '.png']"
  hint="PDF, JPG or PNG (max. 20MB each, up to 10 files)"
  (filesUploaded)="onLegalDocsUploaded($event)"
  (fileDeleted)="onLegalDocDeleted($event)"
/>
```

```typescript
onLegalDocsUploaded(guids: string[]): void {
  this.legalDocIds = guids;
}

onLegalDocDeleted(guid: string): void {
  console.log('Deleted:', guid);
}
```

### Image-Only Upload

```html
<app-file-uploader
  header="Profile Photo"
  category="avatar"
  [acceptedExtensions]="['.jpg', '.jpeg', '.png', '.webp']"
  [maxFileSize]="2"
  hint="JPG, PNG or WebP (max. 2MB)"
  (filesUploaded)="onAvatarUploaded($event)"
/>
```

### Inside a Reactive Form

```html
<form [formGroup]="contractForm">
  <div class="form-field">
    <app-file-uploader
      header="Attachment"
      category="attachment"
      [multiple]="true"
      [maxFiles]="3"
      (filesUploaded)="contractForm.get('attachments')!.setValue($event)"
    />
  </div>
</form>
```

## File States

| State | Visual |
|-------|--------|
| **Uploading** | Progress bar with percentage |
| **Success** | Green ✅ "Complete" badge, full progress bar |
| **Error** | Red ❌ "Failed" badge, red border, "Try again" link |

## Importing

```typescript
import { FileUploaderComponent } from '../shared/file-uploader/file-uploader.component';

@Component({
  imports: [FileUploaderComponent],
  // ...
})
```
