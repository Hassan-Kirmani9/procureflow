import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { BudgetsApiService } from "../../../core/services/budgets.service";

@Component({
  standalone: true,
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule
  ]
})
export class BudgetsComponent implements OnInit {

  budgets: any[] = []
  loading = false
  showDialog = false
  showEditDialog = false
  selectedBudget: any = null

  form = new FormGroup({
    department: new FormControl(''),
    fiscalYear: new FormControl(new Date().getFullYear()),
    totalAmount: new FormControl(0)
  })

  editForm = new FormGroup({
    totalAmount: new FormControl(0)
  })

  constructor(
    private budgetsService: BudgetsApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadBudgets() }

  loadBudgets() {
    this.loading = true
    this.budgetsService.getAllWithUtilization().subscribe({
      next: (data) => {
        this.budgets = data
        this.loading = false
        this.cdr.detectChanges()
      },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  openDialog() {
    this.showDialog = true
    this.form.reset({ fiscalYear: new Date().getFullYear(), totalAmount: 0 })
  }

  createBudget() {
    this.budgetsService.create(this.form.value).subscribe({
      next: () => { this.showDialog = false; this.loadBudgets() },
      error: (err) => console.error(err)
    })
  }

  openEditDialog(budget: any) {
    this.selectedBudget = budget
    this.showEditDialog = true
    this.editForm.setValue({ totalAmount: budget.totalAmount })
  }

  updateBudget() {
    this.budgetsService.update(
      this.selectedBudget._id,
      this.editForm.value.totalAmount || 0
    ).subscribe({
      next: () => { this.showEditDialog = false; this.loadBudgets() },
      error: (err) => console.error(err)
    })
  }
}