import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class SuppliersApiService {

  private apiUrl = 'http://localhost:3000/api'

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/suppliers`)
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/suppliers/${id}`)
  }

  create(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/suppliers`, payload)
  }

  verify(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/suppliers/${id}/verify`, {})
  }

  blacklist(id: string, notes: string) {
    return this.http.patch<any>(`${this.apiUrl}/suppliers/${id}/blacklist`, { notes })
  }

  updateScore(id: string, score: number) {
    return this.http.patch<any>(`${this.apiUrl}/suppliers/${id}/score`, { score })
  }
}