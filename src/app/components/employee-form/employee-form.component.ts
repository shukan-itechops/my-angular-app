import { Component, inject } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IEmployee } from '../../interface/interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [MatInputModule,MatButtonModule,RouterLink,FormsModule,ReactiveFormsModule,MatSnackBarModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {

  httpService = inject(HttpService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  employeeForm = this.formBuilder.group({
      name:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      age:['',[Validators.required]],
      phone:['',[Validators.required]],
      salary:['',[Validators.required]],
  });

  employeeId! : number;
  isEdit = false;
  ngOnInit(){
    this.employeeId = this.route.snapshot.params['id'];
    if(this.employeeId){
      this.isEdit = true;
      this.httpService.getEmployee(this.employeeId).subscribe(result=>{
        console.log(result);
        if (Array.isArray(result)) {
          console.error('Unexpected result: getEmployee returned an array instead of a single object.');
        } else {
          this.employeeForm.patchValue(result);
        }

      });
    }
  }

  save(){
    console.log(this.employeeForm.value);
    const employee:IEmployee = {
      name: this.employeeForm.value.name!,
      email: this.employeeForm.value.email!,
      phone:this.employeeForm.value.phone!.toString(),
      age: parseInt(this.employeeForm.value.age as string, 10),
      salary: parseInt(this.employeeForm.value.salary as string, 10)
    };

    if(this.isEdit){
      this.httpService.updatedEmployee(this.employeeId,employee).subscribe(()=>{
        console.log("success");
        this.showSnackbar('Employee updated successfully');
        this.router.navigateByUrl("/employee-list");
      });
    }
    else{
      this.httpService.createEmployee(employee).subscribe(()=>{
        console.log("success");
        this.showSnackbar('Employee added successfully');
        this.router.navigateByUrl("/employee-list");
      });
    }
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  goBack() {
    this.router.navigateByUrl('/employee-list');
  }


}
