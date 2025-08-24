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
import { Dashboard, DashboardGroup } from 'src/app/interfaces/IDashboard.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'dashboard-form',
  templateUrl: './dashboard.form.component.html',
})
export class DashboardFormComponent implements OnInit, OnChanges {
  roles: string[] = ['guest', 'level1', 'level2', 'admin'];

  dashboardForm!: FormGroup;
  dashboardName: null | string = null;
  dashboardDescription: null | string = null;

  @Input() buttonLabel: string = 'Create';
  @Input() dashboard: Dashboard | null;
  @Input() dashboardGroups: DashboardGroup[] = [];
  @Output() formSubmit = new EventEmitter<Dashboard>();
  @Output() showLoader = new EventEmitter<boolean>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardGroups();
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
          value: this.dashboardDescription,
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
          disabled: true,
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

  loadDashboardGroups() {
    this.showLoader.emit(true);
    const url = `dashboard-groups`;

    this.apiService.get(url).subscribe({
      next: ({ data }) => {
        this.dashboardGroups = data.map(
          ({ attributes, id }) =>
            ({ ...attributes, ...{ id: id } }) as DashboardGroup,
        );
        this.dashboardAttributesToForm();
        this.dashboardForm.get('groupId')?.enable({ emitEvent: false });

        this.showLoader.emit(false);
      },
      error: (error) => {
        this.showLoader.emit(false);
      },
      complete: () => {
        this.showLoader.emit(false);
      },
    });
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
      groupId: this.dashboard.group_id,
      dashboardId: this.dashboard.dashboard_id,
      domain: this.dashboard.superset_domain,
      roles: this.dashboard.roles,
    });
  }
}
