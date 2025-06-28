import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { ReportResponse } from '../interface/interface';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apiUrl = environment.apiUrl;

  http = inject(HttpClient);
  constructor() { }

  getReport(){
    return this.http.get<ReportResponse[]>(this.apiUrl+"/Report/user-payment");
  }
}
