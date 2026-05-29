import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class RfqApiService {

  private apiUrl = 'http://localhost:3000/api'

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/rfq`)
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/rfq/${id}`)
  }

  create(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/rfq`, payload)
  }

  getMyInvitations() {
    return this.http.get<any[]>(`${this.apiUrl}/rfq/my-invitations`)
  }

  submitQuote(rfqId: string, payload: any) {
    return this.http.post<any>(`${this.apiUrl}/rfq/${rfqId}/quote`, payload)
  }

  selectWinner(rfqId: string, supplierId: string) {
    return this.http.patch<any>(`${this.apiUrl}/rfq/${rfqId}/winner/${supplierId}`, {})
  }

  closeRfq(rfqId: string) {
    return this.http.patch<any>(`${this.apiUrl}/rfq/${rfqId}/close`, {})
  }
}