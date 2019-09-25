import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import {
  FamilyUserListResponse,
  FamilyUser,
  UserId
} from 'src/app/model/family';
import { Observable, Subject } from 'rxjs';
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
  users: FamilyUser[];
  headers: HttpHeaders = new HttpHeaders();

  private userUpdatedCallback = new Subject<User>();
  userUpdatedCallback$ = this.userUpdatedCallback.asObservable();

  constructor(private http_service: HttpService) {
    this.headers = this.headers
      .set('accept', 'application/json')
      .set('content-type', 'application/json');
  }

  setUser(user: User) {
    this.user = user;
    this.userUpdatedCallback.next(user);
  }

  doGetUsersList(): Observable<FamilyUserListResponse> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    return this.http_service.doGet(Routes.FAMILY_USERS, options);
  }

  doUserPost(body: User): Observable<User> {
    const headers = new HttpHeaders()
      .set('accept', 'application/json')
      .set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    };

    const formData = this.getFormData(body);

    return this.http_service.doPost(Routes.FAMILY_USERS, formData, options);
  }

  doUserIdGet(id: number): Observable<User> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    return this.http_service.doGet(Routes.FAMILY_USERS + id + '/', options);
  }

  doUserIdPut(id: number, body: User): Observable<User> {
    const headers = new HttpHeaders()
      .set('accept', 'application/json')
      .set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    };
    return this.http_service.doPut(
      Routes.FAMILY_USERS + id + '/',
      this.getFormData(body),
      options
    );
  }

  doUserIdPatch(id: number, body: User): Observable<User> {
    const headers = new HttpHeaders()
      .set('accept', 'application/json')
      .set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    };
    return this.http_service.doPatch(
      Routes.FAMILY_USERS + id + '/',
      this.getFormData(body),
      options
    );
  }

  doUserIdDelete(id: number): Observable<any> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    return this.http_service.doDelete(Routes.FAMILY_USERS + id, options);
  }

  doUserIdContactTypeGet(
    id: number,
    type: string
  ): Observable<ContactResponse> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const params = new HttpParams().set('type', type);
    const options = {
      headers: headers,
      params: params
    };
    return this.http_service.doGet(
      Routes.FAMILY_USERS + id + '/contacts/',
      options
    );
  }

  doUserIdEventGet(
    id: number,
    type: string,
    after: any,
    before: any
  ): Observable<EventResponse> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const params = new HttpParams()
      .set('type', type)
      .set('date_before', before)
      .set('date_after', after);
    const options = {
      headers: headers,
      params: params
    };
    return this.http_service.doGet(
      Routes.FAMILY_USERS + id + '/events/',
      options
    );
  }

  doUserIdEventIdDelete(userId: number, eventId: number): Observable<any> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    return this.http_service.doDelete(
      Routes.FAMILY_USERS + userId + '/events/' + eventId + '/',
      options
    );
  }

  doUserIdEventByTypeGet(id: number, type: string): Observable<EventResponse> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const params = new HttpParams().set('type', type);
    const options = {
      headers: headers,
      params: params
    };
    return this.http_service.doGet(
      Routes.FAMILY_USERS + id + '/events/',
      options
    );
  }

  doUserIdEventByDateGet(
    id: number,
    after: any,
    before: any
  ): Observable<EventResponse> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const params = new HttpParams()
      .set('date_before', before)
      .set('date_after', after);
    const options = {
      headers: headers,
      params: params
    };
    return this.http_service.doGet(
      Routes.FAMILY_USERS + id + '/events/',
      options
    );
  }

  doUserIdEventCalendarByDateGet(
    id: number,
    after: any,
    before: any
  ): Observable<any> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const params = new HttpParams()
      .set('date_before', before)
      .set('date_after', after);
    const options = {
      headers: headers,
      params: params
    };
    return this.http_service.doGet(
      Routes.FAMILY_USERS + id + '/events/calendar/',
      options
    );
  }

  doUserIdDocumentGet(id: number, type: string): Observable<DocumentResponse> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const params = new HttpParams().set('type', type);
    const options = {
      headers: headers,
      params: params
    };
    return this.http_service.doGet(
      Routes.FAMILY_USERS + id + '/documents/',
      options
    );
  }

  doUserIdContactGet(id: number): Observable<ContactResponse> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    return this.http_service.doGet(
      Routes.FAMILY_USERS + id + '/contacts/',
      options
    );
  }

  doUsersIdSendInvitePost(body: UserId): Observable<UserId> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    return this.http_service.doPost(
      Routes.FAMILY_USERS + body.id + '/sendInvite/',
      body,
      options
    );
  }

  private getFormData(body): FormData {
    const formData = new FormData();
    Object.keys(body).forEach(key => {
      if (key === 'address') {
        if (body[key]) {
          Object.keys(body[key]).forEach(key2 =>
            formData.append(
              this.converSnakecase(key + '.' + key2),
              body[key][key2]
            )
          );
        }
      } else if (key === 'referredBy') {
        if (body[key]) {
          Object.keys(body[key]).forEach(key2 =>
            formData.append(
              this.converSnakecase(key + '.' + key2),
              body[key][key2]
            )
          );
        }
      } else if (key === 'coordinate') {
        if (body[key]) {
          Object.keys(body[key]).forEach(key2 =>
            formData.append(
              this.converSnakecase(key + '.' + key2),
              body[key][key2]
            )
          );
        }
      } else if (key === 'avatar') {
        formData.append('avatar', body[key]);
      } else if (key === 'allergies') {
        let i = 0;
        for (const allergy of body[key]) {
          formData.append('allergy_' + i, allergy.toString());
          i++;
        }
      } else if (key === 'favorites') {
        for (const fav of body[key]) {
          formData.append('favorites', fav.toString());
        }
      } else if (key === 'dislikes') {
        for (const dis of body[key]) {
          formData.append('dislikes', dis.toString());
        }
      } else if (key === 'wishlist') {
        for (const wish of body[key]) {
          formData.append('wishlist', wish.toString());
        }
      } else if (key === 'relationships') {
        for (const rel of body[key]) {
          formData.append('relationships', rel.toString());
        }
      } else {
        formData.append(this.converSnakecase(key), body[key]);
      }
    });
    return formData;
  }

  private converSnakecase(name: string): string {
    return name
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase();
  }

  clean() {
    this.user = null;
    this.users = null;
  }
}
