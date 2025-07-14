import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { DashboardGroup } from 'src/app/interfaces/IDashboard.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'create-dashboard-group',
  templateUrl: './create_dashboard_group.component.html',
})
export class CreateDashboardGroupComponent implements OnInit {
  dashboardGroup: DashboardGroup | null;

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private communication: CommunicationService,
    private awareness: AwarenessService,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  createDashboardGroup(attributes: DashboardGroup) {
    this.ApiResponseStatus.processing = true;

    let payload = {
      data: {
        attributes: attributes,
        type: 'Dashboard Group',
      },
    };

    this.apiService.postRequest('dashboard-groups', payload).subscribe({
      next: (response) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;

        let dashboardGroup = {
          ...response.data.attributes,
          ...{ id: response.data.id },
        } as DashboardGroup;

        this.dashboardGroup = dashboardGroup;
        this.communication.showToast('Dashboard group created succesfully');
        this.router.navigate(['/dashboards/groups']);
      },

      error: (error) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = false;

        this.communication.showToast(
          'Dashboard group creation failed. Please again.',
        );
      },
      complete: () => {},
    });
  }

  showLoader(value: boolean) {
    requestAnimationFrame(() => (this.ApiResponseStatus.processing = value));
  }
}
