import { Component, inject } from '@angular/core';
import { IEmployee } from '../../interface/interface';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [MatTableModule,MatButtonModule,RouterLink,MatSnackBarModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {


  router = inject(Router);
  snackBar = inject(MatSnackBar);
  employeeList: IEmployee[] = [];
  httpService = inject(HttpService);
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'age',
    'salary',
    'action'
  ];

  ngOnInit(): void {
      this.httpService.getAllEmployee().subscribe((result)=>{
        this.employeeList = result;
        console.log(this.employeeList);
      })
  }

  edit(id:number){
    console.log(id);
    this.router.navigateByUrl("/employee/"+id);

  }
  delete(id:number){
    this.httpService.deletedEmployee(id).subscribe((es)=>{
      console.log(es);
      this.showSnackbar('Employee deleted successfully');
      this.employeeList = this.employeeList.filter(x=>x.id!=id);
    })
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

}
