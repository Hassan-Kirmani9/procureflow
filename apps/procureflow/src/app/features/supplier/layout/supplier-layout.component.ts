import { Component } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  standalone: true,
  selector: 'app-supplier-layout',
  templateUrl: './supplier-layout.component.html',
  imports: [RouterModule]
})
export class SupplierLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout()
    this.router.navigate(['/auth/login'])
  }
}