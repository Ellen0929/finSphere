import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FinancialGoalRequest {
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string | null;
    userId: number;
}

export interface FinancialGoalResponse {
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string | null;
    userId: number;
}

@Injectable({
    providedIn: 'root'
})
export class FinancialGoalService {

    private readonly apiUrl =
        'http://localhost:8080/api/goals';

    constructor(
        private http: HttpClient
    ) { }

    findByUser(
        userId: number
    ): Observable<FinancialGoalResponse[]> {

        return this.http.get<FinancialGoalResponse[]>(
            `${this.apiUrl}/user/${userId}`
        );
    }

    create(
        goal: FinancialGoalRequest
    ): Observable<FinancialGoalResponse> {

        return this.http.post<FinancialGoalResponse>(
            this.apiUrl,
            goal
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }

    updateCurrentAmount(
        id: number,
        currentAmount: number
    ): Observable<FinancialGoalResponse> {
        return this.http.patch<FinancialGoalResponse>(
            `${this.apiUrl}/${id}/current-amount`,
            currentAmount
        );
    }
}