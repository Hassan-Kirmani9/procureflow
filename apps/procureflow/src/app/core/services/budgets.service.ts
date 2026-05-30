import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class BudgetsApiService {

  private apiUrl = 'https://procureflow-backend-jexo.onrender.com/api'

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/budgets`)
  }

  getAllWithUtilization() {
    return this.http.get<any[]>(`${this.apiUrl}/budgets/utilization`)
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/budgets/${id}`)
  }

  create(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/budgets`, payload)
  }

  update(id: string, totalAmount: number) {
    return this.http.patch<any>(`${this.apiUrl}/budgets/${id}`, { totalAmount })
  }
}