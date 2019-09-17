import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  key: string;
  id: number;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  doGet(url: string, options: any): Observable<any> {
    return this.http.get(this.configService.serverUrl + url, options);
  }

  doPost(url: string, body: any, options: any): Observable<any> {
    console.log(url, body, options);
    return this.http.post(this.configService.serverUrl + url, body, options);
  }

  doPut(url: string, body: any, options: any): Observable<any> {
    return this.http.put(this.configService.serverUrl + url, body, options);
  }

  doPatch(url: string, body: any, options: any): Observable<any> {
    return this.http.patch(this.configService.serverUrl + url, body, options);
  }

  doDelete(url: string, options: any): Observable<any> {
    return this.http.delete(this.configService.serverUrl + url, options);
  }

  clean() {
    this.key = null;
  }
}
