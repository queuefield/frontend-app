import { Component } from '@angular/core';
import { FileUploaderComponent } from '../shared/file-uploader/file-uploader.component';


@Component({
  selector: 'app-general-settings',
  imports: [FileUploaderComponent],
  template: `
<app-file-uploader
  header="Profile Photo"
  category="avatar"
  [acceptedExtensions]="['.jpg', '.jpeg', '.png', '.webp']"
  [maxFileSize]="2"
  hint="JPG, PNG or WebP (max. 2MB)"
  (filesUploaded)="onAvatarUploaded($event)"
    (filesDataUploaded)="onFullDataUploaded($event)"

/>
  <div class="form-field">
    <app-file-uploader
      header="Attachment"
      category="attachment"
      [multiple]="true"
      [maxFiles]="3"
      (filesUploaded)="onAvatarUploadeds($event)"
        (filesDataUploaded)="onFullDataUploaded($event)"

    />
  </div>
  `,
  styles: [

  ],
})
export class GeneralSettingsComponent {

  onAvatarUploaded(event: any){
    console.log(event);
  }
  onAvatarUploadeds(event: any){
    console.log(event);
  }
  onFullDataUploaded(event: any){
    console.log(event);
  }
}
