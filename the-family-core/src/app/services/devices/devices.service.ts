import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Routes } from '../config/routes-enum';
import { DevicesResponse } from 'src/app/model/devices';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  headers: HttpHeaders = new HttpHeaders();

  constructor(private http_service: HttpService) {
    this.headers = this.headers.set('accept', 'application/json')
                               .set('Content-Type', 'application/json');
  }

  doDevicesGet(): Observable<DevicesResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doGet(Routes.DEVICES, options);
  }
}
