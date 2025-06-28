import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Ingredient } from '../../interface/interface';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredient-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatTabsModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './ingredient-form-dialog.html',
  styleUrl: './ingredient-form-dialog.scss'
})
export class IngredientFormDialog {

  private formBuilder = inject(FormBuilder);
  private httpService = inject(HttpService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<IngredientFormDialog>);
  selectedTab = 1;

  ingredientForm = this.formBuilder.group({
    ingredient: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]],
    userId: ['']
  });

  isEdit = false;
  ingredientId?: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data?.ingredient) {
      this.isEdit = true;
      this.ingredientId = data.ingredient.id;
      this.ingredientForm.patchValue({
        ingredient: data.ingredient.ingredientName,
        amount: data.ingredient.amount,
        userId: data.ingredient.userId
      });

      if (data.ingredient.ingredientName === 'Butter Milk') {
        this.ingredientForm.get('ingredient')?.disable();
      }
    }
  }

  save() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.showSnackbar('User not authenticated');
      return;
    }

    this.ingredientForm.patchValue({ userId });

    const rawValue = this.ingredientForm.getRawValue();

    const ingredient: Ingredient = {
      ingredientName: rawValue.ingredient ?? "",
      amount: parseFloat(rawValue.amount ?? ""),
      userId: rawValue.userId ?? ""
    };

    const saveAction = this.isEdit
      ? this.httpService.updatedIngredient(this.ingredientId!, ingredient)
      : this.httpService.createIngredient(ingredient);

    saveAction.subscribe(() => {
      this.showSnackbar(this.isEdit ? 'Ingredient updated' : 'Ingredient added');
      this.dialogRef.close(true); // signal to reload list
    });
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onTabChange(index: number): void {
    this.selectedTab = index;

    const ingredientControl = this.ingredientForm.get('ingredient');

    if (index === 1) { // Butter Milk
      ingredientControl?.setValue('Butter Milk');
      ingredientControl?.disable();
    } else { // Other Ingredient
      ingredientControl?.reset();
      ingredientControl?.enable();
    }
  }

  get isIngredientDisabled(): boolean {
    return this.ingredientForm.get('ingredient')?.disabled ?? false;
  }



}
