import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatSnackBarModule,MatCardModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  httpService = inject(HttpService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  isEdit = false;

  productFrom = this.formBuilder.group({
    title:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    age:['',[Validators.required]],
    phone:['',[Validators.required]],
    salary:['',[Validators.required]],
});

    save(){

    }

}
