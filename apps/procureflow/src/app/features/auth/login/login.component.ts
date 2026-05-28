import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { CardModule } from "primeng/card";
import { AuthService } from "../../../core/services/auth.service";
import { Router, RouterModule } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    CardModule
  ]
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })
  constructor(private authService: AuthService, private router: Router) { }
  onSubmit() {
    const { email, password } = this.form.value
    this.authService.login(email!, password!).subscribe({

      next: (response) => {
        this.authService.saveToken(response.token)
        const role = this.authService.getRole()
        if (role === 'super_admin') this.router.navigate(['/admin'])
        else if (role === 'procurement_manager') this.router.navigate(['/procurement'])
        else if (role === 'requester') this.router.navigate(['/requester'])
        else if (role === 'supplier') this.router.navigate(['/supplier'])
      },
    })
    error: (err:any) => {
      console.error("Login err", err)
    }
  }



}