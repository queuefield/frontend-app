import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { NavigationPanelComponent } from '../layout/navigation-panel/navigation-panel.component';
import { HeaderPanelComponent } from '../layout/header-panel/header-panel.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, NavigationPanelComponent, HeaderPanelComponent],
  template: `
    <div class="app-layout">
      <app-navigation-panel />

      <div class="main-container" [class.nav-hidden]="!isNavVisible()">
        <app-header-panel />

        <main class="content-area">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        min-height: 100vh;
        background: var(--color-background, #f7fafc);
      }

      .main-container {
        flex: 1;
        margin-left: 250px;
        display: flex;
        flex-direction: column;
        transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &.nav-hidden {
          margin-left: 0;
        }
      }

      .content-area {
        flex: 1;
        overflow-y: auto;
        padding: 0 var(--spacing-md, 1rem) var(--spacing-md, 1rem) var(--spacing-md, 1rem);
      }

      // RTL Support
      :host-context([dir='rtl']) .main-container {
        margin-left: 0;
        margin-right: 250px;

        &.nav-hidden {
          margin-right: 0;
        }
      }

      @media (max-width: 768px) {
        .main-container {
          margin-left: 0;
        }

        :host-context([dir='rtl']) .main-container {
          margin-right: 0;
        }
      }
    `,
  ],
})
export class HomeComponent {
  protected readonly isNavVisible;

  constructor(private navService: NavigationService) {
    this.isNavVisible = this.navService.isNavPanelVisible;
  }
}
