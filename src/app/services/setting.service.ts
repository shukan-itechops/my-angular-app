import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Setting } from '../interface/interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SettingService {

  apiUrl = environment.apiUrl;

  http = inject(HttpClient);
  constructor() { }

  getAllSetting(){
    return this.http.get<Setting[]>(this.apiUrl+"/Setting");
  }

  createSetting(setting: Setting){
    return this.http.post<{ id: string }>(this.apiUrl+"/Setting",setting);
  }

  getSetting(settingId:number){
    return this.http.get<Setting[]>(this.apiUrl+"/Setting/"+settingId);
  }

  updatedSetting(settingId:string,setting:Setting){
    return this.http.put<Setting[]>(this.apiUrl+"/Setting/"+settingId,setting);
  }
}
