import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { RouterModule } from '@angular/router';
import { AwarenessService } from '../../services/awareness.service';

type CardItems = {
  imageUrl: string;
  title: string;
  description: string;
  href: string;
  buttonText: string;
};

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TablerIconsModule,
    MatCardModule,
    NgApexchartsModule,
    MatTableModule,
    RouterModule,
    NgOptimizedImage,
  ],
})
export class HomeComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  @ViewChild('viewMoreContent') targetElement: ElementRef;
  @ViewChild('cardContainer') cardContainer!: ElementRef;
  activeCardIndex = 0;
  cardItems: CardItems[] = [];

  constructor(public awareness: AwarenessService) {}

  ngOnInit() {
    this.cardItems = [
      {
        imageUrl: 'assets/images/resources/dashboards-one.png',
        title: 'Surveillance Dashboards',
        description:
          'View dashboards with surveillance data for diseases of public health concern.',
        buttonText: 'View Dashboards',
        href: '/dashboards',
      },
      {
        imageUrl: 'assets/images/resources/upload-data2.png',
        title: 'Upload Data',
        description: 'Upload data into SHIELD.',
        buttonText: 'Upload Data',
        href: '/surveillance/composites',
      },
      {
        imageUrl: 'assets/images/resources/surveillance3.png',
        title: 'Surveillance Resources',
        description: 'Find Surveillance resources here...',
        buttonText: 'View Resources',
        href: '/resources/composites',
      },
      {
        imageUrl: 'assets/images/new_logo/card_ebrige.png',
        title: 'E-Bridge',
        description:
          'Find predictive data analytic models for disease outbreaks here',
        buttonText: 'View Dashboards',
        href: '/dashboards',
      },
    ];
  }

  scrollToTarget() {
    this.targetElement.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToViewMore() {
    // Get a reference to the viewMoreContent element
    const viewMoreContent = document.querySelector('#cards');

    // Check if the element exists
    if (viewMoreContent) {
      // Scroll to the viewMoreContent element
      viewMoreContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  scrollLeft() {
    this.cardContainer.nativeElement.scrollLeft -= 360;
  }

  scrollRight() {
    this.cardContainer.nativeElement.scrollLeft += 360;
  }

  scrollToCard(index: number) {
    if (this.cardContainer && this.cardContainer.nativeElement) {
      const cardWidth = this.cardContainer.nativeElement.offsetWidth;
      this.cardContainer.nativeElement.scrollLeft = index * cardWidth;
      this.activeCardIndex = index;
    }
  }
}
