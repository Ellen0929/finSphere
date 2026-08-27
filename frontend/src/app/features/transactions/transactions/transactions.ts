import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewTransactionModal } from '../new-transaction-modal/new-transaction-modal';

@Component({
  selector: 'app-transactions',
  imports: [FormsModule, NewTransactionModal],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions {

  isModalOpen = false;

  // Filtros
  searchTerm = '';
  selectedType = '';
  selectedCategory = '';
  selectedMonth = '';

  // Transações
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

  // Abre o modal
  openModal() {
    this.isModalOpen = true;
  }

  // Fecha o modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Filtra as transações
  get filteredTransactions() {
    return this.transactions.filter(transaction => {

      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesType =
        !this.selectedType ||
        transaction.type === this.selectedType;

      const matchesCategory =
        !this.selectedCategory ||
        transaction.category === this.selectedCategory;

      const matchesMonth =
        !this.selectedMonth ||
        this.matchesSelectedMonth(transaction.date);

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesMonth
      );
    });
  }

  // Verifica se a transação pertence ao mês selecionado
  private matchesSelectedMonth(date: string): boolean {

    const months: Record<string, string> = {
      Jan: '01',
      Fev: '02',
      Mar: '03',
      Abr: '04',
      Mai: '05',
      Jun: '06',
      Jul: '07',
      Ago: '08',
      Set: '09',
      Out: '10',
      Nov: '11',
      Dez: '12'
    };

    const parts = date.split(' ');

    if (parts.length !== 3) {
      return false;
    }

    const month = months[parts[1]];
    const year = parts[2];

    return `${year}-${month}` === this.selectedMonth;
  }

  // Adiciona uma nova transação
  addTransaction(transaction: any) {

    const formattedTransaction = {
      ...transaction,
      date: this.formatDate(transaction.date)
    };

    this.transactions.unshift(formattedTransaction);
  }

  // Formata a data para ex: 27 Ago 2026
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
