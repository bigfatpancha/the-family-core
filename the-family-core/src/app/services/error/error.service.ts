import { Injectable } from '@angular/core';
import { GenericError } from 'src/app/model/error';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  showError(err: GenericError) {
    let message = 'Error: ';
    Object.keys(err.error).forEach(key => {
      if (Array.isArray(err.error[key])) {
        err.error[key].forEach(msg => {
          message += msg + ' ';
        });
      } else {
        message += err.error;
      }            
      message += '\n';
    });
    alert('Something went wrong, please try again\n' + message);
  }
}
