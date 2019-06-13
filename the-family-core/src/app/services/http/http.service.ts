import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService, Config } from '../config/config.service';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class HttpService implements OnInit {

  options: any = {
    'accept': 'application/json',
    'X-CSRFToken': 'kDPv99rjLwwd17u5RYbgFEawHWzjSgptofCLJpky4c7GkV8qr9itiMu04jmtYdNf'
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  ngOnInit() {
  }

  doGet(url: string, options: any): Observable<any> {
    console.log('GET', this.configService.serverUrl + url)
    return this.http.get(this.configService.serverUrl + url, this.options);
  }

  doPost(url: string, body: any, options: any) {
    return this.http.post(this.configService.serverUrl + url, body, options);
  }

}
