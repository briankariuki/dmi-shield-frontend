import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../pages/ui-components/confirmation_dialog/confirmation_dialog.component';
import { ConfirmationDialogData } from '../interfaces/IDialog.model';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(
    data: ConfirmationDialogData,
    config?: MatDialogConfig,
  ): Observable<boolean | undefined> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data,
      width: '440px',
      disableClose: false,
      ...config,
    });

    return dialogRef.afterClosed();
  }

  async confirm(data: Omit<ConfirmationDialogData, 'type'>): Promise<boolean> {
    const result = await firstValueFrom(
      this.openDialog({
        ...data,
        type: 'confirm',
      }),
    );
    return result === true;
  }

  async confirmDelete(
    data: Omit<ConfirmationDialogData, 'type'>,
  ): Promise<boolean> {
    const result = await firstValueFrom(
      this.openDialog({
        ...data,
        type: 'danger',
      }),
    );
    return result === true;
  }

  async alert(data: Omit<ConfirmationDialogData, 'type'>): Promise<void> {
    await firstValueFrom(
      this.openDialog({
        ...data,
        type: 'alert',
        confirmText: data.confirmText || 'OK',
      }),
    );
  }

  async info(data: Omit<ConfirmationDialogData, 'type'>): Promise<boolean> {
    const result = await firstValueFrom(
      this.openDialog({ ...data, type: 'info' }),
    );
    return result === true;
  }
}
