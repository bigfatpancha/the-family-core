import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService, Config } from '../config/config.service';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class HttpService implements OnInit {


  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  ngOnInit() {
  }

  doGet(url: string, options: any): Observable<any> {
    return this.http.get(this.configService.serverUrl + url, options);
  }

  doPost(url: string, body: any, options: any) {
    return this.http.post(this.configService.serverUrl + url, body, options);
  }

}
