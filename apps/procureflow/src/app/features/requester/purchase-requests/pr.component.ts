import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { SelectModule } from "primeng/select";
import { PurchaseRequestsApiService } from "../../../core/services/purchase-requests.service";

@Component({
  standalone: true,
  selector: 'app-pr',
  templateUrl: './pr.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    TagModule,
    SelectModule
  ]
})
export class PRComponent implements OnInit {

  prs: any[] = []
  showDialog = false
  loading = false

  priorities = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ]

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    category: new FormControl(''),
    department: new FormControl(''),
    budgetCode: new FormControl(''),
    estimatedCost: new FormControl(0),
    quantity: new FormControl(1),
    priority: new FormControl('medium'),
  })

  constructor(private prService: PurchaseRequestsApiService) {}

  ngOnInit() { this.loadPRs() }

  loadPRs() {
    this.loading = true
    this.prService.getMyPRs().subscribe({
      next: (data) => { this.prs = data; this.loading = false },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  openDialog() {
    this.showDialog = true
    this.form.reset({ priority: 'medium', quantity: 1, estimatedCost: 0 })
  }

  createPR() {
    this.prService.create(this.form.value).subscribe({
      next: () => { this.showDialog = false; this.loadPRs() },
      error: (err) => console.error(err)
    })
  }

  getSeverity(status: string) {
    const map: any = {
      draft: 'secondary',
      submitted: 'info',
      under_review: 'warn',
      approved: 'success',
      rejected: 'danger'
    }
    return map[status] || 'info'
  }
}