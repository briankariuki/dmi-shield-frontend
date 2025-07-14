import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DashboardGroup } from 'src/app/interfaces/IDashboard.model';

@Component({
  selector: 'dashboard-group-item',
  templateUrl: './dashboard_group.item.component.html',
})
export class DashboardGroupItemComponent implements OnInit {
  @Input() dashboardGroup: DashboardGroup | null;
  @Input() buttonLabel: string = 'Create';
  @Output() deleteDashboardGroup = new EventEmitter<string>();

  ngOnInit(): void {}

  onDeleteDashboardGroup(id: string) {
    this.deleteDashboardGroup.emit(id);
  }
}
