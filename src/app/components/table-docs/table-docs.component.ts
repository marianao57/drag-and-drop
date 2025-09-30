import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-docs',
  templateUrl: './table-docs.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./table-docs.component.css'],
})
export class TableDocsComponent {
  @Input() filesUploaded: { file: File; downloadUrl: string }[] = [];
  @Input() filesGenerated: { file: File; downloadUrl: string }[] = [];
  @Input() showLoading: boolean = false;

  fileUrls = new Map<File, string>();

  ngOnInit() {
    //this.getDocuments();
  }

  ngOnChanges() {
    this.fileUrls.clear();
    [...this.filesUploaded, ...this.filesGenerated].forEach((fileObj) => {
      return this.fileUrls.set(fileObj.file, URL.createObjectURL(fileObj.file));
    });
  }

  async downloadFile(url: string): Promise<void> {
    const fileObj =
      this.filesUploaded.find((f) => f.downloadUrl === url) ||
      this.filesGenerated.find((f) => f.downloadUrl === url);

    if (fileObj && fileObj.downloadUrl) {
      window.open(fileObj.downloadUrl, '_blank');
    }
  }

  downloadFileUpload(fileName: string): void {
    const fileObj = this.filesUploaded.find((f) => f.file.name === fileName);
    if (fileObj && fileObj.file) {
      const url = URL.createObjectURL(fileObj.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileObj.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}
