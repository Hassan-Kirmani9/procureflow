import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class PurchaseRequestsApiService {

  private apiUrl = 'https://procureflow-backend-jexo.onrender.com/api'

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/purchase-requests`)
  }

  getMyPRs() {
    return this.http.get<any[]>(`${this.apiUrl}/purchase-requests/my`)
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/purchase-requests/${id}`)
  }

  create(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/purchase-requests`, payload)
  }

  updateStatus(id: string, status: string, comment?: string, rejectionReason?: string) {
    return this.http.patch<any>(`${this.apiUrl}/purchase-requests/${id}/status`, {
      status, comment, rejectionReason
    })
  }
}