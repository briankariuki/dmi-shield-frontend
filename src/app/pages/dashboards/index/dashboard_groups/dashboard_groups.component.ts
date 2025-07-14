import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationService } from 'src/app/services/communication.service';
import { debounceTime, Subject } from 'rxjs';
import { Page } from 'src/app/interfaces/IPage.Model';
import { PageEvent } from '@angular/material/paginator';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { DashboardGroup } from 'src/app/interfaces/IDashboard.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AwarenessService } from 'src/app/services/awareness.service';

@Component({
  selector: 'dashboard-groups',
  templateUrl: './dashboard_groups.component.html',
})
export class DashboardGroupsComponent implements OnInit {
  dashboardGroups: DashboardGroup[] = [];
  userRole: string;
  latestSearchTerm: string = '';
  page: Page = {
    count: 0,
    limit: 10,
    next: null,
    prev: null,
  };

  private searchQuery$ = new Subject<string>();

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private awareness: AwarenessService,
    private apiService: ApiService,
    private communication: CommunicationService,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.authenticationService.getApiCurrentUserRole().subscribe({
      next: (role) => {
        this.userRole = role;
      },
      error: (err) => {
        console.error('Error fetching user role', err);

        this.router.navigate(['/authentication/login']);
      },
    });

    this.loadDashboardGroups();

    this.searchQuery$.pipe(debounceTime(500)).subscribe((term) => {
      this.loadDashboardGroups({ searchQuery: term });
    });
  }

  onSearch(event: Event): void {
    let term = (event.target as HTMLInputElement).value;
    this.latestSearchTerm = term;
    this.searchQuery$.next(term);
  }

  loadDashboardGroups({
    searchQuery = null,
    page = null,
  }: { searchQuery?: string; page?: string } = {}) {
    this.ApiResponseStatus.processing = true;
    const userData = this.awareness.getUserData();

    let url = '';

    if (searchQuery) {
      url = `dashboard-groups?user_id=${userData.id}&sort=-created_at&page[limit]=${this.page.limit}&filter[name_matches][input][search]=${searchQuery}`;
    } else if (page === 'next') {
      let temp = this.page.next.split('?')[1];
      url = `dashboard-groups?${temp}`;
    } else if (page === 'prev') {
      let temp = this.page.prev.split('?')[1];
      url = `dashboard-groups?${temp}`;
    } else {
      url = `dashboard-groups?user_id=${userData.id}&sort=-created_at&page[limit]=${this.page.limit}`;
    }

    this.apiService.get(url).subscribe({
      next: (res) => {
        this.dashboardGroups = res.data.map((item) => {
          return { ...item.attributes, ...{ id: item.id } } as DashboardGroup;
        });

        this.page = {
          ...this.page,
          ...{
            next: res.links.next || res.links.prev,
            prev: res.links.prev || res.links.next,
            count: res.meta.page.total,
          },
        };
      },
      error: (error) => {
        this.ApiResponseStatus.success = false;
        this.ApiResponseStatus.processing = false;

        this.communication.showToast('Something went wrong. Please again.');
      },
      complete: () => {
        this.ApiResponseStatus.success = true;
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  deleteDashboardGroup(id: string) {
    this.ApiResponseStatus.processing = true;

    this.apiService.deleteRequest(`dashboard-groups/${id}`).subscribe({
      next: (_) => {
        this.communication.showToast('DashboardGroup deleted succesfully');
        this.dashboardGroups = this.dashboardGroups.filter(
          (item) => item.id !== id,
        );
      },
      error: (_) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = false;

        this.communication.showToast(
          'Failed to delete dashboardGroup. Please again.',
        );
      },
      complete: () => {
        this.ApiResponseStatus.success = true;
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  parseDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString();
  }

  onPageChanged(event: PageEvent) {
    if (event.pageSize != this.page.limit) {
      this.page.limit = event.pageSize;
      this.loadDashboardGroups();

      return;
    }

    if (event.pageIndex > event.previousPageIndex) {
      this.loadDashboardGroups({ page: 'next' });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.loadDashboardGroups({ page: 'prev' });
    }
  }
}
