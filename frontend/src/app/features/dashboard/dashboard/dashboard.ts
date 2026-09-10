import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import { RouterLink } from '@angular/router';
import localePt from '@angular/common/locales/pt';
import {
  TransactionService,
  TransactionResponse
} from '../../../core/services/transaction.service';
import {
  FinancialGoalService,
  FinancialGoalResponse
} from '../../../core/services/financial-goal.service';
import { FormsModule } from '@angular/forms';

registerLocaleData(localePt);

interface CategoryExpense {
  name: string;
  amount: number;
  percentage: number;
}

interface MonthlySummary {
  label: string;
  income: number;
  expenses: number;
}

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink, FormsModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

  userId = 1;

  income = signal(0);
  expenses = signal(0);
  balance = signal(0);

  recentTransactions = signal<TransactionResponse[]>([]);

  categoryExpenses = signal<CategoryExpense[]>([]);

  monthlyResult = signal(0);

  monthlySummary = signal<MonthlySummary[]>([]);

  maxMonthlyValue = signal(0);

  selectedPeriod = signal<'6months' | 'year'>('6months');

  allTransactions = signal<TransactionResponse[]>([]);

  financialGoals = signal<FinancialGoalResponse[]>([]);

  isGoalModalOpen = signal(false);

  goalName = '';
  goalTargetAmount: number | null = null;
  goalCurrentAmount: number | null = null;
  goalDeadline = '';
  goalFormError = '';

  isGoalAmountModalOpen = signal(false);

  selectedGoal = signal<FinancialGoalResponse | null>(null);

  goalAmountToAdd: number | null = null;
  goalAmountError = '';

  constructor(
    private transactionService: TransactionService,
    private financialGoalService: FinancialGoalService
  ) { }

  ngOnInit(): void {
    this.loadSummary();
    this.loadFinancialGoals();
  }

  loadSummary(): void {

    this.transactionService
      .getIncome(this.userId)
      .subscribe({
        next: (value) => {
          this.income.set(value);
        },
        error: (error) => {
          console.error('Erro ao carregar receitas:', error);
        }
      });

    this.transactionService
      .getExpenses(this.userId)
      .subscribe({
        next: (value) => {
          this.expenses.set(value);
        },
        error: (error) => {
          console.error('Erro ao carregar despesas:', error);
        }
      });

    this.transactionService
      .getBalance(this.userId)
      .subscribe({
        next: (value) => {
          this.balance.set(value);
        },
        error: (error) => {
          console.error('Erro ao carregar saldo:', error);
        }
      });

    this.transactionService
      .findByUser(this.userId)
      .subscribe({
        next: (transactions) => {

          this.allTransactions.set(transactions);

          this.recentTransactions.set(
            [...transactions]
              .sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 4)
          );

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const expenses = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);

            return (
              transaction.type === 'EXPENSE' &&
              transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear
            );
          });

          const totalExpenses = expenses.reduce(
            (total, transaction) => total + Number(transaction.amount),
            0
          );

          const categoryMap = new Map<string, number>();

          expenses.forEach(transaction => {
            const currentAmount =
              categoryMap.get(transaction.categoryName) ?? 0;

            categoryMap.set(
              transaction.categoryName,
              currentAmount + Number(transaction.amount)
            );
          });

          const categories = Array.from(categoryMap.entries())
            .map(([name, amount]) => ({
              name,
              amount,
              percentage:
                totalExpenses > 0
                  ? Math.round((amount / totalExpenses) * 100)
                  : 0
            }))
            .sort((a, b) => b.amount - a.amount);

          this.categoryExpenses.set(categories);

          const monthlyTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);

            return (
              transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear
            );
          });

          const monthlyIncome = monthlyTransactions
            .filter(transaction => transaction.type === 'INCOME')
            .reduce(
              (total, transaction) => total + Number(transaction.amount),
              0
            );

          const monthlyExpenses = monthlyTransactions
            .filter(transaction => transaction.type === 'EXPENSE')
            .reduce(
              (total, transaction) => total + Number(transaction.amount),
              0
            );

          this.monthlyResult.set(
            monthlyIncome - monthlyExpenses
          );

          const monthlyData: MonthlySummary[] = [];

          for (let i = 5; i >= 0; i--) {
            const date = new Date(
              currentYear,
              currentMonth - i,
              1
            );

            const month = date.getMonth();
            const year = date.getFullYear();

            const monthTransactions = transactions.filter(transaction => {
              const transactionDate = new Date(transaction.date);

              return (
                transactionDate.getMonth() === month &&
                transactionDate.getFullYear() === year
              );
            });

            const income = monthTransactions
              .filter(transaction => transaction.type === 'INCOME')
              .reduce(
                (total, transaction) =>
                  total + Number(transaction.amount),
                0
              );

            const expenses = monthTransactions
              .filter(transaction => transaction.type === 'EXPENSE')
              .reduce(
                (total, transaction) =>
                  total + Number(transaction.amount),
                0
              );

            monthlyData.push({
              label: date
                .toLocaleDateString('pt-BR', { month: 'short' })
                .replace('.', ''),
              income,
              expenses
            });
          }

          this.monthlySummary.set(monthlyData);

          const maxValue = Math.max(
            ...monthlyData.flatMap(month => [
              month.income,
              month.expenses
            ]),
            1
          );

          this.maxMonthlyValue.set(maxValue);
        },
        error: (error) => {
          console.error('Erro ao carregar transações recentes:', error);
        }
      });
  }

  loadFinancialGoals(): void {
    this.financialGoalService
      .findByUser(this.userId)
      .subscribe({
        next: (goals) => {
          this.financialGoals.set(goals);
        },
        error: (error) => {
          console.error(
            'Erro ao carregar metas financeiras:',
            error
          );
        }
      });
  }

  onPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedPeriod.set(
      select.value as '6months' | 'year'
    );

    this.updateChartData();
  }

  updateChartData(): void {
    const transactions = this.allTransactions();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyData: MonthlySummary[] = [];

    const monthsToShow =
      this.selectedPeriod() === 'year'
        ? currentMonth + 1
        : 6;

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(
        currentYear,
        currentMonth - i,
        1
      );

      const month = date.getMonth();
      const year = date.getFullYear();

      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);

        return (
          transactionDate.getMonth() === month &&
          transactionDate.getFullYear() === year
        );
      });

      const income = monthTransactions
        .filter(transaction => transaction.type === 'INCOME')
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount),
          0
        );

      const expenses = monthTransactions
        .filter(transaction => transaction.type === 'EXPENSE')
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount),
          0
        );

      monthlyData.push({
        label: date
          .toLocaleDateString('pt-BR', { month: 'short' })
          .replace('.', ''),
        income,
        expenses
      });
    }

    this.monthlySummary.set(monthlyData);

    const maxValue = Math.max(
      ...monthlyData.flatMap(month => [
        month.income,
        month.expenses
      ]),
      1
    );

    this.maxMonthlyValue.set(maxValue);
  }

  calculateGoalPercentage(
    currentAmount: number,
    targetAmount: number
  ): number {

    if (targetAmount <= 0) {
      return 0;
    }

    const percentage =
      (Number(currentAmount) / Number(targetAmount)) * 100;

    return Math.min(
      Math.round(percentage),
      100
    );
  }

  openGoalModal(): void {
    this.isGoalModalOpen.set(true);
  }

  closeGoalModal(): void {
    this.goalName = '';
    this.goalTargetAmount = null;
    this.goalCurrentAmount = null;
    this.goalDeadline = '';
    this.goalFormError = '';

    this.isGoalModalOpen.set(false);
  }

  openGoalAmountModal(goal: FinancialGoalResponse): void {
    this.selectedGoal.set(goal);
    this.goalAmountToAdd = null;
    this.isGoalAmountModalOpen.set(true);
  }

  closeGoalAmountModal(): void {
    this.isGoalAmountModalOpen.set(false);
    this.selectedGoal.set(null);
    this.goalAmountToAdd = null;
    this.goalAmountError = '';
  }

  saveGoalAmount(): void {

    this.goalAmountError = '';

    const goal = this.selectedGoal();

    if (!goal) {
      return;
    }

    if (
      this.goalAmountToAdd === null ||
      this.goalAmountToAdd <= 0
    ) {
      this.goalAmountError =
        'Informe um valor maior que zero.';
      return;
    }

    const newCurrentAmount =
      Number(goal.currentAmount) +
      this.goalAmountToAdd;

    this.financialGoalService
      .updateCurrentAmount(
        goal.id,
        newCurrentAmount
      )
      .subscribe({
        next: () => {
          this.loadFinancialGoals();
          this.closeGoalAmountModal();
        },
        error: (error) => {
          console.error(
            'Erro ao atualizar valor da meta:',
            error
          );
        }
      });
  }

  saveFinancialGoal(): void {

    this.goalFormError = '';

    if (!this.goalName.trim()) {
      this.goalFormError = 'Informe o nome da meta.';
      return;
    }

    if (
      this.goalTargetAmount === null ||
      this.goalTargetAmount <= 0
    ) {
      this.goalFormError =
        'Informe um valor da meta maior que zero.';
      return;
    }

    if (
      this.goalCurrentAmount !== null &&
      this.goalCurrentAmount < 0
    ) {
      this.goalFormError =
        'O valor inicial não pode ser negativo.';
      return;
    }

    const request = {
      name: this.goalName,
      targetAmount: this.goalTargetAmount!,
      currentAmount: this.goalCurrentAmount ?? 0,
      deadline: this.goalDeadline || null,
      userId: this.userId
    };

    this.financialGoalService
      .create(request)
      .subscribe({
        next: () => {
          this.loadFinancialGoals();
          this.closeGoalModal();

          this.goalName = '';
          this.goalTargetAmount = null;
          this.goalCurrentAmount = null;
          this.goalDeadline = '';
        },
        error: (error) => {
          console.error(
            'Erro ao criar meta financeira:',
            error
          );
        }
      });
  }
  deleteFinancialGoal(id: number): void {

    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta meta?'
    );

    if (!confirmed) {
      return;
    }

    this.financialGoalService
      .delete(id)
      .subscribe({
        next: () => {
          this.loadFinancialGoals();
        },
        error: (error) => {
          console.error(
            'Erro ao excluir meta financeira:',
            error
          );
        }
      });
  }
}
