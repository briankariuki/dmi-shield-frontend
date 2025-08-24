import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AwarenessService } from 'src/app/services/awareness.service';
import { User } from 'src/app/models/User.model';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommunicationService } from '../../../services/communication.service';
import {
  ApiResponseStatus,
  UserSignOutData,
} from '../../../interfaces/IAuth.model';
import { ApiService } from '../../../services/api/api.service';
import { NotificationModel } from '../../../models/Notification.model';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  distinctUntilChanged,
  fromEvent,
  map,
  Subject,
  takeUntil,
  throttleTime,
} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  scrollTop = 0;
  hideNav = false;
  headerFixed = false;
  navbarOpen = false;
  showFiller = false;
  showMenu: boolean = false;
  showNotificationCard: boolean = false;
  activeRoute: string;
  currentUser: User = new User();
  userData: UserSignOutData;
  Notifications: NotificationModel[] = [];
  userRole: string;

  private topHeaderHeight: number | null = null;
  private readonly scrollThreshold = 50;

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public awareness: AwarenessService,
    private location: Location,
    private communication: CommunicationService,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.getUser();

    this.router.events.subscribe((events) => {
      if (events instanceof NavigationEnd) {
        this.updateActiveRoute();
      }
    });

    this.activeRoute = this.location.path();

    this.authenticationService.getApiCurrentUserRole().subscribe({
      next: (role) => {
        if (role) {
          this.userRole = role;

          this.getApiNotifications();
        }
      },
      error: (err) => console.error('Error fetching user role', err),
    });

    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'scroll', { passive: true })
        .pipe(
          throttleTime(32), // ~60fps
          map(() => window.pageYOffset || document.documentElement.scrollTop),
          distinctUntilChanged((prev, curr) => Math.abs(prev - curr) < 5),
          takeUntil(this.destroy$),
        )
        .subscribe((currentScrollTop) => {
          this.handleScrollLogic(currentScrollTop);
        });
    });
  }

  getUser() {
    this.awareness.currentUser = this.awareness.getUserData();
  }

  updateActiveRoute(): void {
    this.activeRoute = this.router.url;
  }

  viewPrevious() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleScrollLogic(currentScrollTop: number): void {
    if (this.topHeaderHeight === null) {
      const topHeaderElement = document.querySelector(
        '#top-header',
      ) as HTMLElement;
      this.topHeaderHeight = topHeaderElement?.clientHeight || 0;
    }

    const isScrollingDown = currentScrollTop > this.scrollTop;

    this.ngZone.run(() => {
      if (isScrollingDown && currentScrollTop > this.scrollThreshold) {
        this.hideNav = true;
      } else if (!isScrollingDown) {
        this.hideNav = false;
      }

      // Header fixed state
      this.headerFixed = currentScrollTop > this.topHeaderHeight;
      this.scrollTop = currentScrollTop;
    });
  }

  signOut() {
    this.authenticationService.signOut();
    this.awareness.removeUserData();
    this.router.navigate(['/home']);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleMenuIcon() {
    const menuIcon = document.getElementById('menu-icon');
    const sideDrawer = document.querySelector('.side-drawer');
    this.navbarOpen = !this.navbarOpen;

    if (menuIcon && sideDrawer) {
      menuIcon.classList.toggle('bx-x');
      sideDrawer.classList.toggle('open');
    }
  }

  notificationClicked() {
    this.communication.showToast('No new notifications.');
  }

  getApiNotifications() {
    const userId = this.awareness.currentUser.id;

    if (!userId) {
      this.ApiResponseStatus.processing = false;
      return;
    }

    if (!this.awareness.currentUser.id || !this.awareness.currentUser.id) {
      this.ApiResponseStatus.processing = false;
      return;
    } else {
      const url = `notification?user_id=${this.awareness.currentUser.id}`;

      this.apiService.get(url).subscribe({
        next: (res) => {
          this.ApiResponseStatus.success = true;
          this.Notifications = res.data
            .map((item) => ({
              id: item.id,
              ...item.attributes,
            }))
            .filter((item) => item.status !== 'read')
            .sort((a, b) => b.created_at - a.created_at);
        },
        error: (error) => {
          this.ApiResponseStatus.processing = false;
        },
        complete: () => {
          this.ApiResponseStatus.processing = false;
        },
      });
    }
  }
}
