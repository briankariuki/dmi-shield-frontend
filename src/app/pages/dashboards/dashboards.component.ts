import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, Subject } from 'rxjs';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { DashboardGroup } from 'src/app/interfaces/IDashboard.model';
import { Page } from 'src/app/interfaces/IPage.Model';
import { ApiService } from 'src/app/services/api/api.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit {
  dashboardGroups: DashboardGroup[] = [];

  latestSearchTerm: string = '';

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  page: Page = {
    count: 0,
    limit: 50,
    next: null,
    prev: null,
  };

  private searchQuery$ = new Subject<string>();

  constructor(
    public communication: CommunicationService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
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

    let url = '';

    if (searchQuery) {
      url = `dashboard-groups?&sort=-created_at&page[limit]=${this.page.limit}&filter[name_matches][input][search]=${searchQuery}`;
    } else if (page === 'next') {
      let temp = this.page.next.split('?')[1];
      url = `dashboard-groups?${temp}`;
    } else if (page === 'prev') {
      let temp = this.page.prev.split('?')[1];
      url = `dashboard-groups?${temp}`;
    } else {
      url = `dashboard-groups?&sort=-created_at&page[limit]=${this.page.limit}`;
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
