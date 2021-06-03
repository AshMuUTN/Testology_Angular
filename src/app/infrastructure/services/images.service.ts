import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '@entities/image/image';
import { MessageResponse } from '@entities/message-response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(
    private http: HttpClient
  ) {}

  public postImage(params: Image): Observable<Image> {
    const formData = new FormData();
    formData.append('image', params.image);
    formData.append('id', params.id.toString());
    formData.append('path', "path"); // TODO :: path should NOT be required field in backend
    const url = `${environment.backendServer}/api/images`;
    return this.http.post<Image>(url, formData);
  }

  public getImages(): Observable<Image[]> {
    const url = `${environment.backendServer}/api/images`;
    return this.http.get<Image[]>(url, this.httpOptions);
  }
}
