import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionRequest {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  categoryId: number;
  userId: number;
}

export interface TransactionResponse {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  categoryId: number;
  categoryName: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  findByUser(userId: number): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  create(transaction: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(
      this.apiUrl,
      transaction
    );
  }
}