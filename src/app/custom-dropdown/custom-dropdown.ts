import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  imports: [CommonModule],
  templateUrl: './custom-dropdown.html',
  styleUrl: './custom-dropdown.scss'
})
export class CustomDropdown {
  @Input() label: string = '';
  @Input() options: { label: string; value: string }[] = [];

  @Input() selectedValue: string = ''; // property half of two-way binding

  @Output() selectedValueChange = new EventEmitter<string>(); // event half
  @Output() selectionChange = new EventEmitter<void>(); // optional

  isOpen = false;

  get selectedLabel(): string {
    const selected = this.options.find(o => o.value === this.selectedValue);
    return selected ? selected.label : 'Select';
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: { label: string; value: string }) {
    this.selectedValue = option.value;
    this.selectedValueChange.emit(option.value); // triggers ngModel update
    this.selectionChange.emit(); // notify parent manually
    this.isOpen = false;
  }
}
