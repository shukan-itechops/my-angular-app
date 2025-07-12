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
import { AuthService } from '../../services/auth.service';
import { CustomDropdown } from '../../custom-dropdown/custom-dropdown';

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
    MatSelectModule,
    CustomDropdown
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {


  router = inject(Router);
  snackBar = inject(MatSnackBar);
  ingredientList: Ingredient[] = [];
  httpService = inject(HttpService);
  authService = inject(AuthService);
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

  currentPage = 1;
  pageSize = 3;
  totalItems = 0;
  totalPages: number = 0;
  pageRange: number[] = [];

  uniqueUserNames: string[] = [];
  years: string[] = [];
  currentUserId: string | null = null;
  showActionColumn: boolean = false;
  userRole: string | null = null;

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
    this.currentUserId = this.authService.getUserId();
    this.userRole = this.authService.getUserRole();
    this.initYearOptions();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    this.filters.selectedMonth = currentMonth; // 👈 set current month
    this.loadIngredients();
  }

  loadIngredients() {
    this.httpService.getAllIngredient(this.currentPage, this.pageSize, this.filters).subscribe((response) => {
      this.ingredientList = response.items;
      this.totalItems = response.totalCount;
      this.showActionColumn = this.ingredientList.some(
        x => x.userId === this.currentUserId
      );

      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.generatePageRange();

      const namesSet = new Set<string>(
        response.items.map((x: Ingredient) => x.userName).filter((name): name is string => !!name)
      );
      this.uniqueUserNames = Array.from(namesSet);
    });
  }



  applyFilters() {
    this.currentPage = 1;           // Reset to first page on filter change
    this.loadIngredients();         // Fetch new data from server
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

  generatePageRange() {
    const maxVisible = 3;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    // Adjust start if end goes beyond totalPages
    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    this.pageRange = [];
    for (let i = start; i <= end; i++) {
      this.pageRange.push(i);
    }
  }


  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadIngredients();
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  firstPage() {
    this.goToPage(1);
  }

  lastPage() {
    this.goToPage(this.totalPages);
  }

  get userNameOptions() {
    return this.uniqueUserNames.map(u => ({ label: u, value: u }));
  }

  get monthOptions() {
    return this.months.map(m => ({ label: m.name, value: m.value }));
  }

  get yearOptions() {
    return this.years.map(y => ({ label: y, value: y }));
  }


}
