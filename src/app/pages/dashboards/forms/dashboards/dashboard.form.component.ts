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
import { Dashboard } from 'src/app/interfaces/IDashboard.model';

@Component({
  selector: 'dashboard-form',
  templateUrl: './dashboard.form.component.html',
})
export class DashboardFormComponent implements OnInit, OnChanges {
  roles: string[] = ['guest', 'level_1', 'level_2', 'admin'];
  groups: string[] = [
    'Indicator Based Surveillance',
    'Event Based Surveillance',
    'SARI/ILI Surveillance',
    'COVID 19 Mortality Surveillance',
    'E-Bridge',
    'Outbreak Response',
  ];
  dashboardForm!: FormGroup;

  // dashboardName: null | string = null;
  // dashboardDescription: null | string = null;
  dashboardName: null | string = 'E-Bridge Diarrhoeal Diseases Dashboard';
  dashboardDescription: null | string =
    'Contains data from e-bridge diarrhoeal model and counts for diarrhoeal diseases e.g typhoid, cholera from MOH 505, aggregated by epi-week';

  @Input() buttonLabel: string = 'Create';
  @Input() dashboard: Dashboard | null;
  @Output() formSubmit = new EventEmitter<Dashboard>();

  ngOnInit(): void {
    this.dashboardForm = new FormGroup({
      name: new FormControl(
        {
          value: this.dashboardName,
          disabled: false,
        },
        [Validators.required],
      ),
      dashboardId: new FormControl(
        {
          value: '',
          disabled: false,
        },
        [Validators.required],
      ),
      description: new FormControl(
        {
          value: '',
          disabled: false,
        },
        [Validators.required],
      ),
      roles: new FormControl(
        {
          value: [],
          disabled: false,
        },
        [Validators.required],
      ),
      groupId: new FormControl(
        {
          value: '',
          disabled: false,
        },
        [Validators.required],
      ),
      domain: new FormControl(
        {
          value: '',
          disabled: false,
        },
        [Validators.required],
      ),
    });
  }

  onFormSubmit() {
    if (!this.dashboardForm.valid) return;
    let dashboard = this.dashboardFormAttributes(this.dashboardForm);
    this.formSubmit.emit(dashboard);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboard'] && changes['dashboard']?.currentValue) {
      this.dashboard = changes['dashboard'].currentValue;
    }
    this.dashboardAttributesToForm();
  }

  dashboardFormAttributes(dashboardForm: FormGroup): Dashboard {
    let attributes: Dashboard = {
      name: dashboardForm.get('name')?.value,
      description: dashboardForm.get('description')?.value,
      superset_domain: dashboardForm.get('domain')?.value,
      group_id: dashboardForm.get('groupId')?.value,
      dashboard_id: dashboardForm.get('dashboardId')?.value,
      roles: dashboardForm.get('roles')?.value,
    };

    return attributes;
  }

  dashboardAttributesToForm() {
    if (this.dashboard == null) return;

    this.dashboardForm.setValue({
      name: this.dashboard.name,
      description: this.dashboard.description,
    });
  }
}
