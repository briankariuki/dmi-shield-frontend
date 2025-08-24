import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardGroup } from 'src/app/interfaces/IDashboard.model';

@Component({
  selector: 'dashboard-group-form',
  templateUrl: './dashboard_group.form.component.html',
})
export class DashboardGroupFormComponent implements OnInit, OnChanges {
  dashboardGroupForm!: FormGroup;

  groupName: null | string = null;
  groupDescription: null | string = null;

  @Input() buttonLabel: string = 'Create';
  @Input() dashboardGroup: DashboardGroup | null;
  @Output() formSubmit = new EventEmitter<DashboardGroup>();

  ngOnInit(): void {
    this.dashboardGroupForm = new FormGroup({
      name: new FormControl(
        {
          value: this.groupName,
          disabled: false,
        },
        [Validators.required],
      ),
      description: new FormControl(
        {
          value: this.groupDescription,
          disabled: false,
        },
        [Validators.required],
      ),
    });
  }

  onFormSubmit() {
    if (!this.dashboardGroupForm.valid) return;

    let group = this.dashboardGroupFormAttributes(this.dashboardGroupForm);

    this.formSubmit.emit(group);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboardGroup'] && changes['dashboardGroup']?.currentValue) {
      this.dashboardGroup = changes['dashboardGroup'].currentValue;
    }
    this.dashboardGroupAttributesToForm();
  }

  dashboardGroupFormAttributes(dashboardGroupForm: FormGroup): DashboardGroup {
    let attributes: DashboardGroup = {
      name: dashboardGroupForm.get('name')?.value,
      description: dashboardGroupForm.get('description')?.value,
    };

    return attributes;
  }

  dashboardGroupAttributesToForm() {
    if (this.dashboardGroup == null) return;

    this.dashboardGroupForm.setValue({
      name: this.dashboardGroup.name,
      description: this.dashboardGroup.description,
    });
  }
}
