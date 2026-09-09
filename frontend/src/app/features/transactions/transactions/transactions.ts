import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewTransactionModal } from '../new-transaction-modal/new-transaction-modal';
import {
  TransactionService,
  TransactionResponse
} from '../../../core/services/transaction.service';

@Component({
  selector: 'app-transactions',
  imports: [FormsModule, NewTransactionModal],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions implements OnInit {

  isModalOpen = false;

  // Filtros
  searchTerm = '';
  selectedType = '';
  selectedCategory = '';
  selectedMonth = '';

  // Usuário temporário para integração
  userId = 1;

  // Agora a lista vem da API
  transactions: TransactionResponse[] = [];

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadTransactions();

    this.route.queryParamMap.subscribe(params => {
      if (params.get('new') === 'true') {
        this.openModal();
      }
    });
  }

  loadTransactions() {
    this.transactionService
      .findByUser(this.userId)
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
        },
        error: (error) => {
          console.error(
            'Erro ao carregar transações:',
            error
          );
        }
      });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        new: null
      },
      queryParamsHandling: 'merge'
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedCategory = '';
    this.selectedMonth = '';
  }

  get filteredTransactions() {
    return this.transactions.filter(transaction => {

      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesType =
        !this.selectedType ||
        transaction.type.toLowerCase() === this.selectedType;

      const matchesCategory =
        !this.selectedCategory ||
        transaction.categoryName === this.selectedCategory;

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

  private matchesSelectedMonth(date: string): boolean {

    const [year, month] = date.split('-');

    return `${year}-${month}` === this.selectedMonth;
  }

  addTransaction(transaction: any) {

    const categoryIds: Record<string, number> = {
      'Moradia': 1,
      'Alimentação': 2,
      'Transporte': 3,
      'Lazer': 4,
      'Receita': 5,
      'Trabalho': 6
    };

    const request = {
      description: transaction.description,
      amount: transaction.amount,

      type:
        transaction.type === 'income'
          ? 'INCOME' as const
          : 'EXPENSE' as const,

      date: transaction.date,

      categoryId: categoryIds[transaction.category],

      userId: this.userId
    };

    this.transactionService
      .create(request)
      .subscribe({
        next: () => {
          this.loadTransactions();
        },

        error: (error) => {
          console.error(
            'Erro ao cadastrar transação:',
            error
          );
        }
      });
  }

}
