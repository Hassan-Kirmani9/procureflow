import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class PurchaseOrdersApiService {

  private apiUrl = 'http://localhost:3000/api'

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/purchase-orders`)
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/purchase-orders/${id}`)
  }

  getMyOrders() {
    return this.http.get<any[]>(`${this.apiUrl}/purchase-orders/my-orders`)
  }

  createFromRfq(rfqId: string) {
    return this.http.post<any>(`${this.apiUrl}/purchase-orders`, { rfqId })
  }

  approve(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/purchase-orders/${id}/approve`, {})
  }

  acknowledge(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/purchase-orders/${id}/acknowledge`, {})
  }

  cancel(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/purchase-orders/${id}/cancel`, {})
  }
}