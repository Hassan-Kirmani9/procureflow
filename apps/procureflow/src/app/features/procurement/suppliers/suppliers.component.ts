import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { SuppliersApiService } from "../../../core/services/suppliers.service";
import { UsersApiService } from "../../admin/users/users.service";

@Component({
  standalone: true,
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    TagModule
  ]
})
export class SuppliersComponent implements OnInit {

  suppliers: any[] = []
  supplierUsers: any[] = []
  loading = false
  showDialog = false
  showScoreDialog = false
  selectedSupplier: any = null

  form = new FormGroup({
    userId: new FormControl(''),
    companyName: new FormControl(''),
    contactEmail: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    categories: new FormControl(''),
    notes: new FormControl('')
  })

  scoreForm = new FormGroup({
    score: new FormControl(0)
  })

  constructor(
    private suppliersService: SuppliersApiService,
    private usersService: UsersApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadSuppliers()
    this.loadSupplierUsers()
  }

  loadSuppliers() {
    this.loading = true
    this.suppliersService.getAll().subscribe({
      next: (data) => {
        this.suppliers = data
        this.loading = false
        this.cdr.detectChanges()
      },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  loadSupplierUsers() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.supplierUsers = data.filter((u: any) => u.role === 'supplier')
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    })
  }

  openDialog() {
    this.showDialog = true
    this.form.reset()
  }

  createSupplier() {
    const formValue = this.form.value
    const categories = formValue.categories
      ? formValue.categories.split(',').map((c: string) => c.trim())
      : []
    this.suppliersService.create({ ...formValue, categories }).subscribe({
      next: () => { this.showDialog = false; this.loadSuppliers() },
      error: (err) => console.error(err)
    })
  }

  verify(id: string) {
    this.suppliersService.verify(id).subscribe({
      next: () => this.loadSuppliers(),
      error: (err) => console.error(err)
    })
  }

  blacklist(id: string) {
    this.suppliersService.blacklist(id, 'Blacklisted by procurement').subscribe({
      next: () => this.loadSuppliers(),
      error: (err) => console.error(err)
    })
  }

  openScoreDialog(supplier: any) {
    this.selectedSupplier = supplier
    this.showScoreDialog = true
    this.scoreForm.setValue({ score: supplier.performanceScore })
  }

  updateScore() {
    this.suppliersService.updateScore(
      this.selectedSupplier._id,
      this.scoreForm.value.score || 0
    ).subscribe({
      next: () => { this.showScoreDialog = false; this.loadSuppliers() },
      error: (err) => console.error(err)
    })
  }

  getSeverity(status: string) {
    const map: any = {
      pending: 'warn',
      verified: 'success',
      blacklisted: 'danger'
    }
    return map[status] || 'info'
  }
}