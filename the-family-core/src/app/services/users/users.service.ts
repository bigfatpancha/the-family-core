import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { FamilyUserListResponse, FamilyUser } from 'src/app/model/family';
import { Observable } from 'rxjs';
import { Routes } from '../config/routes-enum';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from 'src/app/model/auth';
import { ContactResponse } from 'src/app/model/contact';
import { EventResponse } from 'src/app/model/events';
import { DocumentResponse } from 'src/app/model/documents';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: User;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http_service: HttpService) {
    this.headers = this.headers.set('accept', 'application/json')
                               .set('content-type', 'application/json');
  }

  doGetUsersList(): Observable<FamilyUserListResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const options = {
      headers: headers
    }
    return this.http_service.doGet(Routes.FAMILY_USERS, options);
  }

  doUserPost(body: User): Observable<User> {
    console.log('este es el do post user')
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const options = {
      headers: headers
    }
    return this.http_service.doPost(Routes.FAMILY_USERS, body, options);
  }

  doUserIdGet(id: number): Observable<User> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const options = {
      headers: headers
    }
    return this.http_service.doGet(Routes.FAMILY_USERS + id + '/', options);
  }

  doUserIdPut(id: number, body: User): Observable<User> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const options = {
      headers: headers
    }
    return this.http_service.doPut(Routes.FAMILY_USERS + id, body, options);
  }

  doUserIdPatch(id: number, body: User): Observable<User> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const options = {
      headers: headers
    }
    return this.http_service.doPatch(Routes.FAMILY_USERS + id, body, options);
  }

  doUserIdDelete(id: number): Observable<any> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const options = {
      headers: headers
    }
    return this.http_service.doDelete(Routes.FAMILY_USERS + id, options);
  }

  doUserIdContactTypeGet(id: number, type: string): Observable<ContactResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const params = new HttpParams().set('type', type);
    const options = {
      headers: headers,
      params: params
    }
    return this.http_service.doGet(Routes.FAMILY_USERS + id + '/contacts/', options);
  }

  doUserIdEventGet(id: number, type: string, after: any, before: any): Observable<EventResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const params = new HttpParams().set('type', type)
                                    .set('before', before)
                                    .set('after', after);
    const options = {
      headers: headers,
      params: params
    }
    return this.http_service.doGet(Routes.FAMILY_USERS + id + '/events/', options);
  }

  doUserIdDocumentGet(id: number, type: string): Observable<DocumentResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const params = new HttpParams().set('type', type);
    const options = {
      headers: headers,
      params: params
    }
    return this.http_service.doGet(Routes.FAMILY_USERS + id + '/documents/', options);
  }

  doUserIdContactGet(id: number): Observable<ContactResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const options = {
      headers: headers
    }
    return this.http_service.doGet(Routes.FAMILY_USERS + id + '/contacts/', options);
  }

}
