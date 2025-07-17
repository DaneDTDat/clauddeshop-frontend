import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'fullImageUrl',
  standalone: true
})
export class FullImageUrlPipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (!value) {
      return '/assets/images/product-placeholder.jpg';
    }
    // If the value is already a full URL, return it as is
    if (value.startsWith('http')) {
      return value;
    }
    return `${environment.baseUrl}${value}`;
  }

}
