import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { Dashboard } from 'src/app/interfaces/IDashboard.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'create-dashboard',
  templateUrl: './create_dashboard.component.html',
})
export class CreateDashboardComponent implements OnInit {
  dashboard: Dashboard | null;

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

  createDashboard(attributes: Dashboard) {
    this.ApiResponseStatus.processing = true;

    let payload = {
      data: {
        attributes: attributes,
        type: 'Dashboard',
      },
    };

    this.apiService.postRequest('dashboards', payload).subscribe({
      next: (response) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;

        let dashboard = {
          ...response.data.attributes,
          ...{ id: response.data.id },
        } as Dashboard;

        this.dashboard = dashboard;
        this.communication.showToast('Dashboard created succesfully');
        this.router.navigate(['/dashboards']);
      },

      error: (error) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = false;

        this.communication.showToast(
          'Dashboard creation failed. Please again.',
        );
      },
      complete: () => {},
    });
  }

  showLoader(value: boolean) {
    requestAnimationFrame(() => (this.ApiResponseStatus.processing = value));
  }
}
