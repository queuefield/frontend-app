export interface NavigationComponent {
  name: string;
  icon: string;
  url: string;
  displayOrder: number;
}

export interface NavigationModule {
  id: string;
  name: string;
  icon: string;
  url?: string;
  displayOrder: number;
  components: NavigationComponent[];
}

export interface NavigationState {
  isNavPanelVisible: boolean;
  expandedModuleId: string | null;
  activeComponentUrl: string | null;
  searchQuery: string;
}

export interface BreadcrumbItem {
  label: string;
  url?: string;
}
