import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
    standalone: true,
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss',
    imports: [RouterModule]
})

export class AdminLayoutComponent {

    constructor(private authService: AuthService, private router: Router) { }
    logout() {
        this.authService.logout()
        this.router.navigate(['/auth/login'])
    }

}