import { Routes } from '@angular/router';
import { DashboardsComponent } from './dashboards.component';
import { AuthGuard } from '../../services/authentication.service';
import { CreateDashboardGroupComponent } from './create/dashboard_group/create_dashboard_group.component';
import { DashboardGroupsComponent } from './index/dashboard_groups/dashboard_groups.component';
import { CreateDashboardComponent } from './create/dashboard/create_dashboard.component';
import { ShowDashboardComponent } from './index/dashboards/show/show_dashboard.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: '',
      //   component: DashboardsComponent,
      // },

      {
        path: 'groups',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: DashboardGroupsComponent,
      },
      {
        path: 'groups/create',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: CreateDashboardGroupComponent,
      },

      {
        path: 'create',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: CreateDashboardComponent,
      },

      {
        path: 'view/:id',
        // canActivate: [AuthGuard],
        // data: { roles: ['admin'] },
        component: ShowDashboardComponent,
      },

      // {
      //   path: ':id',
      //   canActivate: [AuthGuard],
      //   data: { roles: ['level1', 'level2', 'admin'] },
      //   component: DashboardsComponent,
      // },
    ],
  },
];
