import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { DepartmentsApiService } from "./departments.service";

@Component({
  standalone: true,
  selector: 'app-departments',
  templateUrl: './departments.component.html',
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
export class DepartmentsComponent implements OnInit {

  departments: any[] = []
  showDialog = false
  loading = false

  form = new FormGroup({
    name: new FormControl(''),
    code: new FormControl(''),
    budget: new FormControl(0)
  })

  constructor(private deptService: DepartmentsApiService) {}

  ngOnInit() {
    this.loadDepartments()
  }

  loadDepartments() {
    this.loading = true
    this.deptService.getDepartments().subscribe({
      next: (data) => { this.departments = data; this.loading = false },
      error: (err) => { console.error(err); this.loading = false }
    })
  }

  openDialog() {
    this.showDialog = true
    this.form.reset({ budget: 0 })
  }

  createDepartment() {
    this.deptService.createDepartment(this.form.value).subscribe({
      next: () => { this.showDialog = false; this.loadDepartments() },
      error: (err) => console.error(err)
    })
  }

  deactivate(id: string) {
    this.deptService.deactivateDepartment(id).subscribe({
      next: () => this.loadDepartments(),
      error: (err) => console.error(err)
    })
  }
}