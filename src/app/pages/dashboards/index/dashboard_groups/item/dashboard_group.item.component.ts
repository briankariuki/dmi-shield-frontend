import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DashboardGroup } from 'src/app/interfaces/IDashboard.model';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'dashboard-group-item',
  templateUrl: './dashboard_group.item.component.html',
})
export class DashboardGroupItemComponent implements OnInit {
  @Input() dashboardGroup: DashboardGroup | null;
  @Input() buttonLabel: string = 'Create';
  @Output() deleteDashboardGroup = new EventEmitter<string>();

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  async onDeleteDashboardGroup(id: string): Promise<void> {
    const confirmed = await this.dialogService.confirmDelete({
      title: 'Delete Dashboard Group',
      message: 'This will permanently delete the dashboard group. Continue?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      this.deleteDashboardGroup.emit(id);
    }
  }
}
