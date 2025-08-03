import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bufferToBase64',standalone:true, pure: true })
export class BufferToBase64Pipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';
    // Si ya es string
    if (typeof value === 'string') {
      return value;
    }
    // Buffer → base64 puro
    const bytes = new Uint8Array(value.data);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }
}