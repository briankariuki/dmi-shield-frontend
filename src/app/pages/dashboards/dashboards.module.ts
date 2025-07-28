import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DashboardsComponent } from './dashboards.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { DashboardsRoutes } from './dashboards.routing';
import { DashboardGroupItemComponent } from './index/dashboard_groups/item/dashboard_group.item.component';
import { DashboardGroupFormComponent } from './forms/dashboard_groups/dashboard_group.form.component';
import { DashboardGroupsComponent } from './index/dashboard_groups/dashboard_groups.component';
import { CreateDashboardGroupComponent } from './create/dashboard_group/create_dashboard_group.component';
import { CreateDashboardComponent } from './create/dashboard/create_dashboard.component';
import { DashboardFormComponent } from './forms/dashboards/dashboard.form.component';
import { MatIconModule } from '@angular/material/icon';
import { ShowDashboardComponent } from './index/dashboards/show/show_dashboard.component';
import { BreadCrumbsComponent } from 'src/app/layouts/full/breadcrumbs/breadcrumbs.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    NgxFileDropModule,
    MdbCarouselModule,
    MatIconModule,
  ],
  declarations: [
    DashboardsComponent,
    DashboardGroupFormComponent,
    DashboardFormComponent,
    DashboardGroupItemComponent,
    DashboardGroupsComponent,
    CreateDashboardGroupComponent,
    CreateDashboardComponent,
    ShowDashboardComponent,
    BreadCrumbsComponent,
  ],
})
export class DashboardsModule {}
