import { Component } from '@angular/core';

import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-panel',
  imports: [],
  template: `
    <header class="header-panel">
      <div class="header-content">
        <div class="welcome-section">
          <h2 class="welcome-message">
            Welcome back, {{ currentUser()?.username || currentUser()?.email || 'User' }}!
          </h2>

          @if (breadcrumbs().length > 0) {
          <nav class="breadcrumb">
            @for (crumb of breadcrumbs(); track $index; let isLast = $last) { @if (crumb.url &&
            !isLast) {
            <a [href]="crumb.url" class="breadcrumb-link">{{ crumb.label }}</a>
            } @else {
            <span class="breadcrumb-current">{{ crumb.label }}</span>
            } @if (!isLast) {
            <svg
              class="breadcrumb-separator"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            } }
          </nav>
          }
        </div>

        <div class="header-actions">
          <button class="notification-button" title="Notifications">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="notification-badge">3</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .header-panel {
        height: 70px;
        background: var(--color-surface, #ffffff);
        border-radius: var(--radius-lg, 0.75rem);
        margin: var(--spacing-sm, 0.5rem);
        box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
        position: sticky;
        top: var(--spacing-sm, 0.5rem);
        z-index: 100;
      }

      .header-content {
        height: 100%;
        padding: 0 var(--spacing-xl, 2rem);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .welcome-section {
        flex: 1;
      }

      .welcome-message {
        font-size: var(--font-size-lg, 1.125rem);
        font-weight: var(--font-weight-semibold, 600);
        color: var(--color-text-primary, #2d3748);
        margin: 0 0 var(--spacing-xs, 0.25rem) 0;
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs, 0.25rem);
        font-size: var(--font-size-sm, 0.875rem);
      }

      .breadcrumb-link {
        color: var(--color-text-secondary, #718096);
        text-decoration: none;
        transition: var(--transition-base, 300ms cubic-bezier(0.4, 0, 0.2, 1));

        &:hover {
          color: var(--color-primary, #E21D4B);
        }
      }

      .breadcrumb-current {
        color: var(--color-text-primary, #2d3748);
        font-weight: var(--font-weight-medium, 500);
      }

      .breadcrumb-separator {
        width: 14px;
        height: 14px;
        stroke: var(--color-text-disabled, #a0aec0);
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-md, 1rem);
      }

      .notification-button {
        position: relative;
        width: 40px;
        height: 40px;
        background: transparent;
        border: 1px solid var(--color-border, #e2e8f0);
        border-radius: var(--radius-md, 0.5rem);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition-base, 300ms cubic-bezier(0.4, 0, 0.2, 1));

        svg {
          width: 20px;
          height: 20px;
          stroke: var(--color-text-secondary, #718096);
        }

        &:hover {
          background: var(--color-background-light, #f7fafc);
          border-color: var(--color-primary, #E21D4B);

          svg {
            stroke: var(--color-primary, #E21D4B);
          }
        }
      }

      .notification-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 18px;
        height: 18px;
        padding: 0 4px;
        background: var(--color-error, #f56565);
        color: var(--color-text-on-primary, #ffffff);
        font-size: 0.65rem;
        font-weight: var(--font-weight-bold, 700);
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      @media (max-width: 768px) {
        .header-content {
          padding: 0 var(--spacing-md, 1rem);
        }

        .welcome-message {
          font-size: var(--font-size-md, 1rem);
        }

        .breadcrumb {
          font-size: var(--font-size-xs, 0.75rem);
        }
      }
    `,
  ],
})
export class HeaderPanelComponent {
  protected readonly breadcrumbs;
  protected readonly currentUser;

  constructor(private navService: NavigationService, private authService: AuthService) {
    this.breadcrumbs = this.navService.breadcrumbs;
    this.currentUser = this.authService.currentUser;
  }
}
