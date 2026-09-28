import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  downloadReport(format: string = 'pdf'): Observable<Blob> {
    const mockBlob = new Blob(['Mock PDF Report Content'], { type: 'application/pdf' });
    return of(mockBlob);
  }
}
