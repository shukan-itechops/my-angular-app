import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingService } from '../../services/setting.service';
import { Setting } from '../../interface/interface';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  settingForm: FormGroup;
  settingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private snackBar: MatSnackBar
  ) {
    this.settingForm = this.fb.group({
      roomRent: [0, Validators.required],
      cookSalary: [0, Validators.required],
      workerSalary: [0, Validators.required],
      lightBill: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.lodSetting();
  }

  onSubmit() {
    if (this.settingForm.invalid) return;

    if (this.settingId) {
      this.settingService.updatedSetting(this.settingId, this.settingForm.value).subscribe({
        next: () => {
          this.snackBar.open('Setting updated successfully!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Failed to update setting.', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.settingService.createSetting(this.settingForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Setting saved successfully!', 'Close', { duration: 3000 });
          if (response?.id) this.settingId = response.id;
        },
        error: () => {
          this.snackBar.open('Failed to save setting.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  lodSetting() {
    this.settingService.getAllSetting().subscribe({
      next: (settings: Setting[]) => {
        if (settings.length > 0) {
          const setting = settings[0]; // Take the first setting
          this.settingId = setting.id || null;
          this.settingForm.patchValue(setting);
        }
      },
      error: () => {
        this.snackBar.open('Failed to load setting.', 'Close', { duration: 3000 });
      }
    });
  }
}
