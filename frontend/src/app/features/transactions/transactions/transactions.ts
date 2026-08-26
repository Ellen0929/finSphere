import { Component } from '@angular/core';
import { NewTransactionModal } from '../new-transaction-modal/new-transaction-modal';

@Component({
  selector: 'app-transactions',
  imports: [NewTransactionModal],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions {

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  transactions = [
    {
      description: 'Supermercado',
      category: 'Alimentação',
      date: '26 Ago 2026',
      type: 'expense',
      amount: 320
    },
    {
      description: 'Salário',
      category: 'Receita',
      date: '05 Ago 2026',
      type: 'income',
      amount: 6500
    },
    {
      description: 'Aluguel',
      category: 'Moradia',
      date: '03 Ago 2026',
      type: 'expense',
      amount: 1850
    },
    {
      description: 'Freelance',
      category: 'Trabalho',
      date: '01 Ago 2026',
      type: 'income',
      amount: 1200
    }
  ];

  addTransaction(transaction: any) {

    const formattedTransaction = {
      ...transaction,
      date: this.formatDate(transaction.date)
    };

    this.transactions.unshift(formattedTransaction);
  }

  private formatDate(date: string): string {

    const [year, month, day] = date.split('-');

    const months = [
      'Jan', 'Fev', 'Mar', 'Abr',
      'Mai', 'Jun', 'Jul', 'Ago',
      'Set', 'Out', 'Nov', 'Dez'
    ];

    return `${day} ${months[Number(month) - 1]} ${year}`;
  }

}
