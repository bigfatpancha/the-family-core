import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { DocumentResponse, Document } from 'src/app/model/documents';
import { Routes } from '../config/routes-enum';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http_service: HttpService) {
    this.headers = this.headers
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  doDocumentsGet(): Observable<DocumentResponse> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    return this.http_service.doGet(Routes.DOCUMENTS, options);
  }

  doDocumentPost(body: Document): Observable<Document> {
    const headers = new HttpHeaders()
      .set('accept', 'application/json')
      .set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    };
    return this.http_service.doPost(
      Routes.DOCUMENTS,
      this.getFormData(body),
      options
    );
  }

  doDocumentIdPut(documentId: number, body: Document, userId: number) {
    const headers = new HttpHeaders()
      .set('accept', 'application/json')
      .set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    };
    return this.http_service.doPut(
      Routes.FAMILY_USERS + userId + '/documents/' + documentId + '/',
      this.getFormData(body),
      options
    );
  }

  doDocumentIdPatch(documentId: number, body: Document, userId: number) {
    const headers = new HttpHeaders()
      .set('accept', 'application/json')
      .set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    };
    return this.http_service.doPatch(
      Routes.FAMILY_USERS + userId + '/documents/' + documentId + '/',
      this.getFormData(body),
      options
    );
  }

  doDocumentIdDelete(documentId: number, userId: number): Observable<any> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    return this.http_service.doDelete(
      Routes.FAMILY_USERS + userId + '/documents/' + documentId + '/',
      options
    );
  }

  getFormData(body: Document): FormData {
    const formData = new FormData();
    Object.keys(body).forEach(key => {
      if (key === 'attachments') {
        let i = 0;
        for (const attachment of body[key]) {
          console.log(attachment.file);
          formData.append('attachment_' + i + '.file', attachment.file);
          i++;
        }
      } else if (key === 'familyMembers') {
        for (const member of body[key]) {
          formData.append('family_members', member.toString());
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
}
