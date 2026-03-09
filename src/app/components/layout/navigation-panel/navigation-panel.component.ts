import { Component, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../services/auth.service';
import { AppConfigService } from '../../../services/app-config.service';

@Component({
  selector: 'app-navigation-panel',
  imports: [FormsModule],
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

  viewStats(): void {
    this.showUserDropdown = false;
    // Placeholder for stats functionality
    console.log('Stats clicked');
  }
}
