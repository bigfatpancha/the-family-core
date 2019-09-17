import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

export interface Config {
  serverUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  serverUrl = environment.baseUrl;

  constructor() {}
}
