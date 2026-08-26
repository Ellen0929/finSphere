import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-transaction-modal',
  imports: [FormsModule],
  templateUrl: './new-transaction-modal.html',
  styleUrl: './new-transaction-modal.scss'
})
export class NewTransactionModal {

  @Output() close = new EventEmitter<void>();

  @Output() save = new EventEmitter<any>();

  transactionType: 'income' | 'expense' = 'income';

  submitted = false;

  description = '';
  amount: number | null = null;
  date = '';
  category = '';

  selectType(type: 'income' | 'expense') {
    this.transactionType = type;
  }

  closeModal() {
    this.close.emit();
  }

  saveTransaction() {

    this.submitted = true;

    if (
      !this.description ||
      !this.amount ||
      !this.date ||
      !this.category
    ) {
      return;
    }

    const transaction = {
      description: this.description,
      amount: this.amount,
      date: this.date,
      category: this.category,
      type: this.transactionType
    };

    this.save.emit(transaction);
    this.closeModal();
  }

}

