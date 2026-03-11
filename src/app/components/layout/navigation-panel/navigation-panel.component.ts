import { Component, computed, ViewChildren, QueryList } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../services/auth.service';
import { AppConfigService } from '../../../services/app-config.service';
import { NavigationModule } from '../../../models/navigation.model';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-navigation-panel',
  imports: [FormsModule, PopoverModule, RouterLink],
  templateUrl: './navigation-panel.component.html',
  styleUrl: './navigation-panel.component.scss',
})
export class NavigationPanelComponent {
  searchQuery = '';
  showUserDropdown = false;

  // Get data from services
  protected readonly isVisible;
  protected readonly filteredModules;
  protected readonly currentUser;
  protected readonly appName: string;
  protected readonly showLogout: boolean;

  constructor(
    protected navService: NavigationService,
    protected authService: AuthService,
    private configService: AppConfigService
  ) {
    this.isVisible = this.navService.isNavPanelVisible;
    this.filteredModules = this.navService.filteredModules;
    this.currentUser = this.authService.currentUser;
    this.appName = this.configService.getApplicationName();
    this.showLogout = this.configService.isLoginRequired();
  }

  onSearchChange(query: string): void {
    this.navService.setSearchQuery(query);
  }

  toggleModule(moduleId: string): void {
    this.navService.toggleModule(moduleId);
  }

  navigateToComponent(url: string): void {
    this.navService.navigateToComponent(url);
  }

  isModuleExpanded(moduleId: string): boolean {
    return this.navService.isModuleExpanded(moduleId);
  }

  isComponentActive(url: string): boolean {
    return this.navService.isComponentActive(url);
  }

  /** Check if any child component of a module is active */
  hasActiveChild(module: NavigationModule): boolean {
    return module.components.some((c) => this.navService.isComponentActive(c.url));
  }

  /** Handle module click — in collapsed mode show popover, in expanded mode toggle/navigate */
  onModuleClick(event: Event, module: NavigationModule, popover?: Popover): void {
    if (!this.isVisible() && module.components.length > 0 && popover) {
      // Collapsed mode with sub-modules → show popover
      popover.toggle(event);
    } else if (module.components.length > 0) {
      // Expanded mode with sub-modules → toggle expand/collapse
      this.toggleModule(module.id);
    } else if (module.url) {
      // No sub-modules → navigate directly
      this.navigateToComponent(module.url);
    }
  }

  /** Navigate from popover sub-module and close popover */
  navigateFromPopover(url: string, popover: Popover): void {
    this.navigateToComponent(url);
    popover.hide();
  }

  /** Toggle collapsed/expanded */
  toggleCollapse(): void {
    this.navService.toggleNavPanel();
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  navigateToProfile(): void {
    this.showUserDropdown = false;
    this.navService.navigateToComponent('/profile');
  }

  logout(): void {
    this.showUserDropdown = false;
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  onLogout(popover: Popover): void {
    popover.hide();
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  viewStats(): void {
    this.showUserDropdown = false;
    console.log('Stats clicked');
  }
}
