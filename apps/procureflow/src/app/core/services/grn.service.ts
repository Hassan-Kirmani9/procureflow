import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class GrnApiService {

  private apiUrl = 'https://procureflow-backend-jexo.onrender.com/api'

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/grn`)
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/grn/${id}`)
  }

  getByPO(poId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/grn/po/${poId}`)
  }

  create(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/grn`, payload)
  }
}