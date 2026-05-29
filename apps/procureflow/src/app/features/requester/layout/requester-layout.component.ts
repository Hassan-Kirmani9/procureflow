import { Component } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  standalone: true,
  selector: 'app-requester-layout',
  templateUrl: './requester-layout.component.html',
  imports: [RouterModule]
})
export class RequesterLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout()
    this.router.navigate(['/auth/login'])
  }
}