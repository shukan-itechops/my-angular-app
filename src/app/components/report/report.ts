import { Component } from '@angular/core';
import { ReportResponse, Setting } from '../../interface/interface';
import { ReportService } from '../../services/report.service';
import { CommonModule } from '@angular/common';
import { SettingService } from '../../services/setting.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report {

  reports: ReportResponse[] = [];
  loading = true;
  error: string | null = null;

  // Filters
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  totalButterMilk: number = 0;
  totalOther: number = 0;
  roomRent: number = 0;
  cookSalary: number = 0;
  workerSalary: number = 0;
  lightBill: number = 0;


  constructor(private reportService: ReportService, private settingService: SettingService) { }

  ngOnInit(): void {
    this.fetchReport();
  }

  fetchReport(): void {
    this.loading = true;
    this.reportService.getReport(this.selectedYear, this.selectedMonth).subscribe({
      next: (data) => {
        this.reports = data;
        this.calculateTotals();
        this.lodSetting();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load report';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.fetchReport();
  }

  getMonths() {
    return [
      { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
      { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
      { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
      { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' },
    ];
  }

  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  lodSetting() {
    this.settingService.getAllSetting().subscribe({
      next: (settings: Setting[]) => {
        if (settings.length > 0) {
          const setting = settings[0];
          this.roomRent = setting.roomRent;
          this.cookSalary = setting.cookSalary;
          this.workerSalary = setting.workerSalary;
          this.lightBill = setting.lightBill;
        }
      }
    });
  }

  calculateTotals(): void {
    this.totalButterMilk = this.reports.reduce((sum, r) => sum + r.totalButterMilkPaidAmount, 0);
    this.totalOther = this.reports.reduce((sum, r) => sum + r.totalOtherPaidAmount, 0);
  }

  getTotalFixedExpenses(): number {
    const baseFixed = this.roomRent + this.cookSalary + this.workerSalary + this.lightBill;
    const otherTotal = this.totalOther;
    return baseFixed + otherTotal;
  }

  getPerUserFixedExpenseShare(): number {
    const totalFixed = this.getTotalFixedExpenses();
    const userCount = this.reports.length;
    if (userCount === 0) return 0;
    return totalFixed / userCount;
  }

  getEligibleUsers(): ReportResponse[] {
    return this.reports.filter(r => r.isButterMilkEnable); // Adjust based on your actual flag
  }

  getFinalPayableAmount(user: ReportResponse): number {
    const fixedShare = this.getPerUserFixedExpenseShare();

    // ButterMilk logic
    const butterMilkUsers = this.getEligibleUsers();
    const perButterMilkShare = butterMilkUsers.length > 0 ? this.totalButterMilk / butterMilkUsers.length : 0;

    let butterMilkPending = 0;
    let butterMilkAdjustment = 0;

    if (user.isButterMilkEnable) {
      butterMilkPending = perButterMilkShare - user.totalButterMilkPaidAmount;
    } else {
      butterMilkAdjustment = user.totalButterMilkPaidAmount;
    }

    // ⚠️ Do NOT subtract totalOtherPaidAmount anymore — it's part of fixed total!
    // Only subtract total paid toward ButterMilk (if needed)

    const finalDue = fixedShare - user.totalOtherPaidAmount - butterMilkAdjustment + butterMilkPending;

    return Math.round(finalDue * 100) / 100; // Round to 2 decimals
  }



}
