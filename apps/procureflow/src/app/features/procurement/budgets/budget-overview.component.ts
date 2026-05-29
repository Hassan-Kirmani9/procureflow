import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { BudgetsApiService } from "../../../core/services/budgets.service";

@Component({
  standalone: true,
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule
  ]
})
export class BudgetOverviewComponent implements OnInit {

  budgets: any[] = []
  loading = false

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
}