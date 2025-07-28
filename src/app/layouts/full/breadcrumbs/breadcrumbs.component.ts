import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BreadCrumb } from 'src/app/models/Breadcrumb.model';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
})
export class BreadCrumbsComponent implements OnInit, OnChanges {
  @Input() breadcrumbs: BreadCrumb[] = [];

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
}
