import { Component, inject } from '@angular/core';
import { Ingredient } from '../../interface/interface';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpService } from '../../services/http.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IngredientFormDialog } from '../ingredient-form-dialog/ingredient-form-dialog';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {


  router = inject(Router);
  snackBar = inject(MatSnackBar);
  ingredientList: Ingredient[] = [];
  httpService = inject(HttpService);
  displayedColumns: string[] = [
    'name',
    'email',
    'age',
    'date',
    'action'
  ];
  dialog = inject(MatDialog);

  filteredList: Ingredient[] = [];

  filters = {
    userName: '',
    selectedMonth: '',
    selectedYear: ''
  };

  uniqueUserNames: string[] = [];
  years: string[] = [];

  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' },
  ];

  openDialog(ingredient?: any) {
    const dialogRef = this.dialog.open(IngredientFormDialog, {
      width: '400px',
      data: { ingredient }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadIngredients();
    });
  }

  ngOnInit(): void {
    this.initYearOptions();
    this.loadIngredients();
  }

  loadIngredients() {
    this.httpService.getAllIngredient().subscribe((result) => {
      this.ingredientList = result;
      this.filteredList = result;

      const namesSet = new Set(result.map(x => x.userName).filter((name): name is string => !!name));
      this.uniqueUserNames = Array.from(namesSet);

      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      this.filters.selectedMonth = currentMonth;
      this.applyFilters();
    });
  }

  applyFilters() {
    const { userName, selectedMonth, selectedYear } = this.filters;

    this.filteredList = this.ingredientList.filter(item => {
      const matchesUser = !userName || item.userName === userName;

      const createdDate = item.createdAt ? new Date(item.createdAt) : null;
      const itemMonthStr = createdDate ? (createdDate.getMonth() + 1).toString().padStart(2, '0') : '';
      const itemYearStr = createdDate ? createdDate.getFullYear().toString() : '';

      const matchesMonth = !selectedMonth || itemMonthStr === selectedMonth;
      const matchesYear = !selectedYear || itemYearStr === selectedYear;

      return matchesUser && matchesMonth && matchesYear;
    });
  }



  onMonthSelected(event: Date, datepicker: any) {
    this.filters.selectedMonth = formatDate(event, 'yyyy-MM', 'en');
    datepicker.close();
    this.applyFilters();
  }

  edit(id: string) {
    const ingredient = this.ingredientList.find(x => x.id === id);
    if (ingredient) {
      this.openDialog(ingredient); // Pass the ingredient object to the dialog
    } else {
      this.showSnackbar("Ingredient not found.");
    }
  }
  delete(id: string) {
    this.httpService.deletedIngredient(id).subscribe((es) => {
      console.log(es);
      this.showSnackbar('Employee deleted successfully');
      this.ingredientList = this.ingredientList.filter(x => x.id != id);
      this.applyFilters();
    })
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  initYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5; // e.g., show last 5 years

    for (let year = startYear; year <= currentYear; year++) {
      this.years.unshift(year.toString()); // Newest first
    }

    this.filters.selectedYear = currentYear.toString(); // default selected
  }

}
