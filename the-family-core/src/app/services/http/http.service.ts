import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService, Config } from '../config/config.service';



@Injectable({
  providedIn: 'root'
})
export class HttpService implements OnInit {

  private config: Config;

  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  ngOnInit() {
    this.configService.getConfig()
    .subscribe((data: Config) => this.config = data);
  }

  doGet(url: string, options: any) {
    this.http.get(this.config.serverUrl + url, options);
  }

  doPost(url: string, body: any, options: any) {
    this.http.post(this.config.serverUrl + url, body, options);
  }

}
