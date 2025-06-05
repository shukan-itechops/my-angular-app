import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IEmployee } from './interface/interface';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiUrl = environment.apiUrl;

  http = inject(HttpClient);
  constructor() { }

  getAllEmployee(){
    return this.http.get<IEmployee[]>(this.apiUrl+"/Employee");
  }

  createEmployee(employee: IEmployee){
    return this.http.post(this.apiUrl+"/Employee",employee);
  }

  getEmployee(employeeId:number){
    return this.http.get<IEmployee[]>(this.apiUrl+"/Employee/"+employeeId);
  }

  updatedEmployee(employeeId:number,employee:IEmployee){
    return this.http.put<IEmployee[]>(this.apiUrl+"/Employee/"+employeeId,employee);
  }
  deletedEmployee(employeeId:number){
    return this.http.delete(this.apiUrl+"/Employee/"+employeeId);
  }
}
