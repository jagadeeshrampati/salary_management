import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly breadcrumb = signal('Dashboard');

  constructor() {
  this.updateBreadcrumb();

  this.router.events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => this.updateBreadcrumb());

  }

  private updateBreadcrumb(): void {
    const route = this.router.routerState.snapshot.root;
    let currentRoute = route;
    let breadcrumb = '';

    while (currentRoute) {
      const label = currentRoute.data['breadcrumb'];

      if (label) {
        breadcrumb = label;
      }

      const child = currentRoute.firstChild;

      if (!child) {
        break;
      }

      currentRoute = child;
    }

    this.breadcrumb.set(breadcrumb || 'Dashboard');
  }

}
