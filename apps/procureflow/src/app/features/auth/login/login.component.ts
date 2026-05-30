import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    RouterModule
  ]
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  loading = false
  errorMessage = ''

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const { email, password } = this.form.value
    if (!email || !password) {
      this.errorMessage = 'Please enter your email and password'
      return
    }

    this.loading = true
    this.errorMessage = ''

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false
        this.authService.saveToken(response.token)
        const role = this.authService.getRole()
        if (role === 'super_admin') this.router.navigate(['/admin'])
        else if (role === 'procurement_manager') this.router.navigate(['/procurement'])
        else if (role === 'requester') this.router.navigate(['/requester'])
        else if (role === 'supplier') this.router.navigate(['/supplier'])
      },
      error: (err) => {
        this.loading = false
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.'
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please try again later.'
        } else {
          this.errorMessage = err.error?.message || 'Something went wrong. Please try again.'
        }
      }
    })
  }
}