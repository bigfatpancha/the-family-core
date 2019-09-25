import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { Timezone } from 'src/app/model/data';
import { Routes } from '../config/routes-enum';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  headers: HttpHeaders = new HttpHeaders();

  constructor(private httpService: HttpService) {
    this.headers = this.headers
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  doTimezoneGet(): Observable<Timezone[]> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.httpService.key
    );
    const options = {
      headers: headers
    };
    return this.httpService.doGet(Routes.DATA_TIMEZONE, options);
  }
}
