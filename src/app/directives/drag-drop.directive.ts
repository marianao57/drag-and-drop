import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[dragDrop]',
  standalone: true
})
export class DragDropDirective {
  @HostBinding('style.background') private _background =
    'rgba(157, 157, 161, 0.08)';
  @HostBinding('style.border') private _border = '2px dashed #041b6b';
  @HostBinding('style.borderRadius') private _borderRadius = '8px';
  @Output() public files: EventEmitter<File[]> = new EventEmitter();

  @HostListener('dragover', ['$event']) public onDragOver(
    evt: DragEvent,
  ): void {
    evt.preventDefault();
    evt.stopPropagation();
    this._background = '#ecf8fd';
    this._border = '1px dashed #3daad9';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(
    evt: DragEvent,
  ): void {
    evt.preventDefault();
    evt.stopPropagation();
    this._background = 'rgba(157, 157, 161, 0.08)';
    this._border = '1px dashed #041b6b';
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this._background = 'rgba(157, 157, 161, 0.08)';
    this._border = '1px dashed #041b6b';
    const files: File[] = [];
    for (
      let i = 0;
      i < (evt?.dataTransfer as DataTransfer)?.files.length;
      i++
    ) {
      const file = evt?.dataTransfer?.files[i];
      files.push(file!);
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
