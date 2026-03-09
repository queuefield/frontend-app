import { Injectable, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  NavigationModule,
  NavigationComponent,
  NavigationState,
  BreadcrumbItem,
} from '../models/navigation.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly STORAGE_KEY_NAV_STATE = 'nav_state';
  private readonly STORAGE_KEY_EXPANDED_MODULE = 'expanded_module';

  // Navigation modules data
  private modules = signal<NavigationModule[]>([
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: 'home',
      url: '/dashboard',
      displayOrder: 1,
      components: [],
    },
    {
      id: 'user-management',
      name: 'User Management',
      icon: 'users',
      displayOrder: 2,
      components: [
        { name: 'Users List', icon: 'list', url: '/users', displayOrder: 1 },
        { name: 'Roles & Permissions', icon: 'shield', url: '/roles', displayOrder: 2 },
      ],
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: 'settings',
      displayOrder: 3,
      components: [
        { name: 'General Settings', icon: 'sliders', url: '/settings/general', displayOrder: 1 },
        { name: 'Security', icon: 'lock', url: '/settings/security', displayOrder: 2 },
        { name: 'Notifications', icon: 'bell', url: '/settings/notifications', displayOrder: 3 },
      ],
    },
  ]);

  // Navigation state
  private navState = signal<NavigationState>({
    isNavPanelVisible: true,
    expandedModuleId: null,
    activeComponentUrl: null,
    searchQuery: '',
  });

  // Public computed signals
  readonly isNavPanelVisible = computed(() => this.navState().isNavPanelVisible);
  readonly expandedModuleId = computed(() => this.navState().expandedModuleId);
  readonly activeComponentUrl = computed(() => this.navState().activeComponentUrl);
  readonly searchQuery = computed(() => this.navState().searchQuery);

  // Filtered modules based on search
  readonly filteredModules = computed(() => {
    const query = this.navState().searchQuery.toLowerCase();
    if (!query) {
      return this.modules();
    }

    return this.modules()
      .map((module) => {
        const matchesModule = module.name.toLowerCase().includes(query);
        const filteredComponents = module.components.filter((comp) =>
          comp.name.toLowerCase().includes(query)
        );

        if (matchesModule || filteredComponents.length > 0) {
          return {
            ...module,
            components: matchesModule ? module.components : filteredComponents,
          };
        }
        return null;
      })
      .filter((m) => m !== null) as NavigationModule[];
  });

  // Breadcrumb computed from current route
  readonly breadcrumbs = computed(() => {
    const activeUrl = this.navState().activeComponentUrl;
    if (!activeUrl) return [];

    const breadcrumbs: BreadcrumbItem[] = [];

    // Find the module and component
    for (const module of this.modules()) {
      // Check if it's a direct module link
      if (module.url === activeUrl) {
        breadcrumbs.push({ label: module.name, url: module.url });
        break;
      }

      // Check components
      const component = module.components.find((c) => c.url === activeUrl);
      if (component) {
        breadcrumbs.push({ label: module.name });
        breadcrumbs.push({ label: component.name, url: component.url });
        break;
      }
    }

    return breadcrumbs;
  });

  constructor(private router: Router) {
    this.loadState();
    this.listenToRouteChanges();
  }

  /**
   * Load navigation state from localStorage
   */
  private loadState(): void {
    const savedState = localStorage.getItem(this.STORAGE_KEY_NAV_STATE);
    const savedExpandedModule = localStorage.getItem(this.STORAGE_KEY_EXPANDED_MODULE);

    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.navState.update((current) => ({ ...current, ...state }));
      } catch (e) {
        console.error('Failed to parse saved navigation state', e);
      }
    }

    if (savedExpandedModule) {
      this.navState.update((current) => ({ ...current, expandedModuleId: savedExpandedModule }));
    }
  }

  /**
   * Save navigation state to localStorage
   */
  private saveState(): void {
    const state = this.navState();
    localStorage.setItem(
      this.STORAGE_KEY_NAV_STATE,
      JSON.stringify({
        isNavPanelVisible: state.isNavPanelVisible,
      })
    );

    if (state.expandedModuleId) {
      localStorage.setItem(this.STORAGE_KEY_EXPANDED_MODULE, state.expandedModuleId);
    }
  }

  /**
   * Listen to route changes and update active component
   */
  private listenToRouteChanges(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.setActiveComponent(url);
      });

    // Set initial active component
    this.setActiveComponent(this.router.url);
  }

  /**
   * Set active component based on URL
   */
  private setActiveComponent(url: string): void {
    this.navState.update((current) => ({
      ...current,
      activeComponentUrl: url,
    }));

    // Auto-expand the module containing this component
    for (const module of this.modules()) {
      if (module.url === url) {
        this.expandModule(module.id);
        break;
      }

      const hasComponent = module.components.some((c) => c.url === url);
      if (hasComponent) {
        this.expandModule(module.id);
        break;
      }
    }
  }

  /**
   * Toggle navigation panel visibility
   */
  toggleNavPanel(): void {
    this.navState.update((current) => ({
      ...current,
      isNavPanelVisible: !current.isNavPanelVisible,
    }));
    this.saveState();
  }

  /**
   * Expand/collapse a module
   */
  toggleModule(moduleId: string): void {
    const currentExpanded = this.navState().expandedModuleId;
    const newExpanded = currentExpanded === moduleId ? null : moduleId;

    this.navState.update((current) => ({
      ...current,
      expandedModuleId: newExpanded,
    }));
    this.saveState();
  }

  /**
   * Expand a specific module
   */
  expandModule(moduleId: string): void {
    this.navState.update((current) => ({
      ...current,
      expandedModuleId: moduleId,
    }));
    this.saveState();
  }

  /**
   * Update search query
   */
  setSearchQuery(query: string): void {
    this.navState.update((current) => ({
      ...current,
      searchQuery: query,
    }));
  }

  /**
   * Get all modules
   */
  getModules(): NavigationModule[] {
    return this.modules();
  }

  /**
   * Navigate to a component
   */
  navigateToComponent(url: string): void {
    this.router.navigate([url]);
  }

  /**
   * Check if a component is active
   */
  isComponentActive(url: string): boolean {
    return this.navState().activeComponentUrl === url;
  }

  /**
   * Check if a module is expanded
   */
  isModuleExpanded(moduleId: string): boolean {
    return this.navState().expandedModuleId === moduleId;
  }
}
