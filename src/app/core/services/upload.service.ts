import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/uploads`;

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<{ message: string, filepath: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ message: string, filepath: string }>(this.apiUrl, formData);
  }
}
