import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  inject,
} from '@angular/core';
import { DragDropDirective } from 'src/app/directives/drag-drop.directive';
import { CommonModule } from '@angular/common';
import { TableDocsComponent } from '../table-docs/table-docs.component';
import { DocumentsService } from 'src/app/services/documents.service';

@Component({
  selector: 'app-upload-documents',
  standalone: true,
  imports: [DragDropDirective, CommonModule, TableDocsComponent],
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss'],
})
export class UploadDocumentsComponent {
  @Output() public filesUploaded: EventEmitter<File[]> = new EventEmitter();
  maxSize = 10;
  filesUploadedArray: { file: File; downloadUrl: string }[] = [];
  filesGeneratedArray: { file: File; downloadUrl: string }[] = [];
  isLoading = false;

  constructor(private documentsService: DocumentsService) {}

  private _renderer = inject(Renderer2);
  private _el = inject(ElementRef);

  public uploadDocuments(): void {
    const existingFileInput =
      this._el.nativeElement.querySelector('#fileInput');
    const fileInput = !existingFileInput
      ? this._renderer.createElement('input')
      : existingFileInput;
    this._renderer.setAttribute(fileInput, 'type', 'file');
    this._renderer.setAttribute(fileInput, 'multiple', 'true');
    this._renderer.setAttribute(fileInput, 'id', 'fileInput');
    this._renderer.setStyle(fileInput, 'display', 'none');
    this._renderer.appendChild(this._el.nativeElement, fileInput);

    fileInput.click();
    fileInput.addEventListener('change', (event: Event) => {
      const _files = (event.target as HTMLInputElement).files as FileList;
      const _fileList = Object.keys(_files).map((k, index) =>
        _files.item(index)
      );
      this.onDropDocuments(_fileList as File[]);
      this._renderer.removeChild(this._el.nativeElement, fileInput);
    });
  }

  public onDropDocuments(files: File[]): void {
    const allowedExtensions = ['pdf'];
    const filteredFiles = files.filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isAllowed = ext && allowedExtensions.includes(ext);
      const isSizeOk = file.size <= this.maxSize * 1024 * 1024;
      return isAllowed && isSizeOk;
    });

    filteredFiles.forEach((file) => {
      if (
        !this.filesUploadedArray.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        )
      ) {
        this.filesUploadedArray.push({ file, downloadUrl: '' });
        this.uploadFile(file);
      }
    });
    this.filesUploaded.emit(filteredFiles);
  }

  async uploadFile(file: File): Promise<void> {
    try {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', file, file.name);
      const uploadResult = await this.documentsService.uploadDocument({
        originalName: file.name,
        file,
      });
      const document = await this.retryProcessFile({
        document_uuid: uploadResult.data.document_uuid,
        key: uploadResult.data.key,
        bucket: uploadResult.data.bucket,
      });
      const processedFile = {
        file: new File(
          [file],
          file.name.replace(/\.[^/.]+$/, '') + '_processed.pdf',
          { type: file.type }
        ),
        downloadUrl: document.download_url,
      };
      this.filesGeneratedArray.push(processedFile);
    } catch (error) {
      console.error('Error subiendo archivo:', error);
    }
  }

  async retryProcessFile(
    params: { document_uuid: string; key: string; bucket: string },
    retries = 3,
    delayMs = 2000
  ): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.isLoading = true;
        const processResult = await this.documentsService.processFile(params);
        const downloadResult = await this.documentsService.getDownloadUrl(
          processResult
        );
        this.isLoading = false;
        return downloadResult;
      } catch (error) {
        if (attempt === retries) throw error;
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  toArray(fileList: FileList): File[] {
    return Array.from(fileList);
  }
}
