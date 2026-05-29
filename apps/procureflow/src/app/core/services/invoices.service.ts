import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class InvoicesApiService {

  private apiUrl = 'http://localhost:3000/api'

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/invoices`)
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/invoices/${id}`)
  }

  getMyInvoices() {
    return this.http.get<any[]>(`${this.apiUrl}/invoices/my-invoices`)
  }

  create(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/invoices`, payload)
  }

  approve(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/invoices/${id}/approve`, {})
  }

  reject(id: string, reason: string) {
    return this.http.patch<any>(`${this.apiUrl}/invoices/${id}/reject`, { reason })
  }

  markAsPaid(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/invoices/${id}/pay`, {})
  }
}