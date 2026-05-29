import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { RfqApiService } from "../../../core/services/rfq.service";

@Component({
    standalone: true,
    selector: 'app-supplier-rfq',
    templateUrl: './supplier-rfq.component.html',
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
export class SupplierRfqComponent implements OnInit {

    rfqs: any[] = []
    loading = false
    showQuoteDialog = false
    selectedRfq: any = null

    quoteForm = new FormGroup({
        unitPrice: new FormControl(0),
        totalPrice: new FormControl(0),
        deliveryDays: new FormControl(1),
        paymentTerms: new FormControl(''),
        notes: new FormControl('')
    })

    constructor(
        private rfqService: RfqApiService,
        private cdr: ChangeDetectorRef
    ) { }
    ngOnInit() { this.loadInvitations() }

    loadInvitations() {
        this.loading = true
        this.rfqService.getMyInvitations().subscribe({
            next: (data) => {
                this.rfqs = data
                this.loading = false
                this.cdr.detectChanges()
            },
            error: (err) => { console.error(err); this.loading = false }
        })
    }

    openQuoteDialog(rfq: any) {
        this.selectedRfq = rfq
        this.showQuoteDialog = true
        this.quoteForm.reset({ deliveryDays: 1, unitPrice: 0, totalPrice: 0 })
    }

    submitQuote() {
        this.rfqService.submitQuote(this.selectedRfq._id, this.quoteForm.value).subscribe({
            next: () => { this.showQuoteDialog = false; this.loadInvitations() },
            error: (err) => console.error(err)
        })
    }

    getSeverity(status: string) {
        const map: any = {
            open: 'info',
            closed: 'warn',
            awarded: 'success'
        }
        return map[status] || 'info'
    }
}