import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class HttpService implements OnInit {

  key: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  ngOnInit() {
  }

  doGet(url: string, options: any): Observable<any> {
    console.log('GET', this.configService.serverUrl + url)
    return this.http.get(this.configService.serverUrl + url, options);
  }

  doPost(url: string, body: any, options: any): Observable<any> {
    return this.http.post(this.configService.serverUrl + url, body, options);
  }

}
