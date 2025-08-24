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

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
}
