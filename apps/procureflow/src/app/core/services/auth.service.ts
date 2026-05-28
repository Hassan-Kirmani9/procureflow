import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {


    private apirUrl = 'http://localhost:3000/api'

    constructor(private http: HttpClient) { }
    login(email: string, password: string) {
        return this.http.post<any>(`${this.apirUrl}/auth/login`, { email, password })
    }
    register(name: string, role: string, email: string, password: string) {
        return this.http.post<any>(`${this.apirUrl}/auth/register`, { name, email, password, role })
    }
    saveToken(token: string) {
        localStorage.setItem('token', token)
    }
    getToken(): string | null {
        return localStorage.getItem('token')
    }
    getRole(): string | null {
        const token = this.getToken()
        if (!token) return null
        const payload =  JSON.parse(atob(token.split('.')[1]))
        return payload.role
}
    isLoggedIn(): boolean {
        return !!this.getToken()
    }
    logout() {
        localStorage.removeItem('token')
    }
}
