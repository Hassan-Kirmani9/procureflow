import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { UsersApiService } from "./users.service";
import { SelectModule } from "primeng/select";

@Component({
    standalone: true,
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        TableModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        TagModule
    ]
})
export class UsersComponent implements OnInit {

    users: any[] = []
    showDialog = false
    loading = false

    roles = [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Procurement Manager', value: 'procurement_manager' },
        { label: 'Requester', value: 'requester' },
        { label: 'Supplier', value: 'supplier' },
    ]

    form = new FormGroup({
        name: new FormControl(''),
        email: new FormControl(''),
        password: new FormControl(''),
        role: new FormControl('requester'),
        department: new FormControl('')
    })
    constructor(private usersService: UsersApiService, private cdr: ChangeDetectorRef) { }
    ngOnInit() {
        this.loadUsers()
    }

    loadUsers() {
        this.loading = true
        this.usersService.getUsers().subscribe({
            next: (data) => {
                console.log(data) 

                this.users = data
                this.loading = false
                this.cdr.detectChanges()

            },
            error: (err) => {
                console.error(err)
                this.loading = false
            }
        })
    }

    openDialog() {
        this.showDialog = true
        this.form.reset({ role: 'requester' })
    }

    createUser() {
        this.usersService.createUser(this.form.value).subscribe({
            next: () => {
                this.showDialog = false
                this.loadUsers()
            },
            error: (err) => console.error(err)
        })
    }

    deactivateUser(id: string) {
        this.usersService.deactivateUser(id).subscribe({
            next: () => this.loadUsers(),
            error: (err) => console.error(err)
        })
    }

}