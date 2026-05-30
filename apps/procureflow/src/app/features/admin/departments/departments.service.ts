import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class DepartmentsApiService {

  private apiUrl = 'https://procureflow-backend-jexo.onrender.com/api'

  constructor(private http: HttpClient) {}

  getDepartments() {
    return this.http.get<any[]>(`${this.apiUrl}/departments`)
  }

  createDepartment(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/departments`, payload)
  }

  deactivateDepartment(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/departments/${id}/deactivate`, {})
  }
}