import { Component, inject } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ingredient } from '../../interface/interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

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
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  ingredientForm = this.formBuilder.group({
    ingredient: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]],
    userId: ['']  
  });

  ingredientId! : number;
  isEdit = false;
  ngOnInit(){
    this.ingredientId = this.route.snapshot.params['id'];
    if(this.ingredientId){
      this.isEdit = true;
      this.httpService.getIngredient(this.ingredientId).subscribe(result=>{
        console.log(result);
        if (Array.isArray(result)) {
          console.error('Unexpected result: getEmployee returned an array instead of a single object.');
        } else {
          this.ingredientForm.patchValue(result);
        }

      });
    }
  }

  save(){
    console.log(this.ingredientForm.value);
    const userId = this.authService.getUserId();
      if (!userId) {
        this.showSnackbar('User not authenticated');
        return;
    }
    this.ingredientForm.patchValue({ userId });

    const ingredient: Ingredient = {
      ingredientName: this.ingredientForm.value.ingredient!,
      amount: parseFloat(this.ingredientForm.value.amount!),
      userId: this.ingredientForm.value.userId!
    };

    if(this.isEdit){
      this.httpService.updatedIngredient(this.ingredientId,ingredient).subscribe(()=>{
        console.log("success");
        this.showSnackbar('Employee updated successfully');
        this.router.navigateByUrl("/employee-list");
      });
    }
    else{
      this.httpService.createIngredient(ingredient).subscribe(()=>{
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
