import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { Dashboard } from 'src/app/interfaces/IDashboard.model';
import { ApiService } from 'src/app/services/api/api.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { BreadCrumb } from 'src/app/models/Breadcrumb.model';

@Component({
  selector: 'show-dashboard',
  templateUrl: './show_dashboard.component.html',
})
export class ShowDashboardComponent implements OnInit {
  dashboard: Dashboard | null;
  dashboardId: string | null = null;

  breadcrumbs: BreadCrumb[] = [];

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private communication: CommunicationService,
    private elementRef: ElementRef,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.dashboardId = this.route.snapshot.paramMap.get('id');

    this.breadcrumbs = [
      {
        name: 'Home',
      },
      {
        name: 'Dashboards',
      },
    ];
    this.loadDashboard();
  }

  loadDashboard() {
    this.ApiResponseStatus.processing = true;
    const url = `dashboards/embed/${this.dashboardId}`;

    this.apiService.get(url).subscribe({
      next: (res) => {
        let dashboard = {
          ...res.data.attributes,
          ...{ id: res.data.id },
        } as Dashboard;

        this.dashboard = dashboard;

        this.breadcrumbs = [...this.breadcrumbs, { name: dashboard.name }];
        this.ApiResponseStatus.success = true;
      },

      error: (error) => {
        this.ApiResponseStatus.processing = false;
      },
      complete: () => {
        this.ApiResponseStatus.processing = false;
        this.embedDashboard();
      },
    });
  }

  embedDashboard() {
    const dashboardElement =
      this.elementRef.nativeElement.querySelector('#dashboard');

    if (dashboardElement) {
      const mountPoint = document.getElementById('dashboard');

      embedDashboard({
        id: this.dashboard.dashboard_id,
        // id: '3614841c-6680-4e74-af33-ce5f2ea0b357',
        supersetDomain: `https://${this.dashboard.superset_domain}`,
        mountPoint: mountPoint,
        fetchGuestToken: () => {
          return Promise.resolve(this.dashboard.embed_token);
        },
        debug: true,
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: true,
          hideTab: true,
        },
      });

      const iframe = dashboardElement.querySelector('iframe');
      if (iframe) {
        iframe.class = 'view-embedded--dashboard';
        iframe.style['border-radius'] = '20px';
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '1000px';
      }
    }
  }
}
