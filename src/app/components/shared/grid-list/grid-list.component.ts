import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

// PrimeNG
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';

import {
  ColumnsInterface,
  ActionsInterface,
  SearchInterface,
  GridPayload,
  GridResponse,
  FieldLabel,
  GridOptions,
} from '../../../models/grid.model';
import { GridService } from '../../../services/grid.service';
import { GridSearchPanelComponent } from '../grid-search-panel/grid-search-panel.component';

@Component({
  selector: 'app-grid-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    PopoverModule,
    TooltipModule,
    MenuModule,
    BadgeModule,
    TagModule,
    ProgressSpinnerModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
    GridSearchPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid-list.component.html',
  styleUrl: './grid-list.component.scss',
})
export class GridListComponent implements OnInit, OnDestroy {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  /** 'client' or 'lazy' */
  readonly mode = input<'client' | 'lazy'>('client');

  /** Direct data input (client mode only) */
  readonly data = input<any[]>([]);

  /** API URL to fetch data from */
  readonly apiUrl = input<string>('');

  /** HTTP method for client-side API fetch (GET or POST) */
  readonly apiMethod = input<'GET' | 'POST'>('GET');

  /** Column definitions */
  readonly columns = input.required<ColumnsInterface[]>();

  /** Row action definitions */
  readonly actions = input<ActionsInterface[]>([]);

  /** Search filter definitions */
  readonly filters = input<SearchInterface[]>([]);

  /** Rows per page */
  readonly pageSize = input<number>(10);

  /** Paginator options */
  readonly rowsPerPageOptions = input<number[]>([5, 10, 25, 50]);

  /** Placeholder for global search */
  readonly globalSearchPlaceholder = input<string>('Search...');

  /** Optional grid title */
  readonly title = input<string>('');

  /** Grid Options (Add, Export, View toggles) */
  readonly options = input<GridOptions>({});

  /** Module Name for fetching permissions from local storage */
  readonly moduleName = input<string>();

  /** Emitted when the grid data changes */
  readonly dataLoaded = output<any[]>();

  /** Emitted when the Add button is clicked */
  readonly onAddAction = output<void>();

  /** Emitted when the Export button is clicked */
  readonly onExportAction = output<void>();

  /** Emitted when the View row action is clicked */
  readonly onViewAction = output<any>();

  // ── Internal State ─────────────────────────────────────────────────────────
  tableData = signal<any[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  currentPage = signal<number>(0);
  globalSearchValue = signal<string>('');
  activeFilters = signal<Record<string, any>>({});
  filterCount = signal<number>(0);
  filterTooltip = signal<string>('');
  first = signal<number>(0);

  /** Per-row action menu visibility */
  activeActionRow = signal<any>(null);

  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();
  private gridService = inject(GridService);

  // ── Computed & Getters ─────────────────────────────────────────────────────
  hasFilters = computed(() => this.filters().length > 0);

  get showAddBtn(): boolean {
    return !!this.options().showAdd && this.hasPermission('add');
  }

  get showExportBtn(): boolean {
    return !!this.options().showExport && this.hasPermission('export');
  }

  get showViewIcon(): boolean {
    return !!this.options().showView && this.hasPermission('view');
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  constructor() {
    // React to direct data input changes (client + data mode)
    // Synchronously populates tableData if provided immediately.
    effect(() => {
      const inputData = this.data();
      if (this.mode() === 'client' && inputData && inputData.length > 0 && !this.apiUrl()) {
        this.tableData.set(inputData);
        this.totalRecords.set(inputData.length);
        this.dataLoaded.emit(inputData);
      }
    });
  }

  /**
   * Initializes the component by loading saved filters and setting up the
   * global search debouncer. Fetches initial data based on the mode.
   */
  ngOnInit(): void {
    // Load saved filters
    this.loadSavedFilters();

    // Setup global search debounce
    this.subscriptions.add(
      this.searchSubject
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe((searchKey) => {
          this.onGlobalSearchDebounced(searchKey);
        })
    );

    // Initial data load
    if (this.mode() === 'client' && this.apiUrl()) {
      this.fetchClientData();
    }
    // Note: For lazy mode, PrimeNG p-table automatically emits (onLazyLoad) on init,
    // so we don't call fetchLazyData() here to avoid a duplicate API request.
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.searchSubject.complete();
  }

  // ── Private Helpers ────────────────────────────────────────────────────────

  /**
   * Reads the active filters from local storage (if a moduleName is provided)
   * and restores the grid's visual state.
   */
  private loadSavedFilters(): void {
    if (!this.moduleName()) return;

    try {
      const saved = localStorage.getItem(`${this.moduleName()}_filters`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Object.keys(parsed).length > 0) {
          this.activeFilters.set(parsed);
          this.updateFilterMetadata(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse saved grid filters', e);
    }
  }

  /**
   * Calculates the number of active filters and builds a multi-line tooltip string
   * containing the localized labels for the active filter values.
   *
   * @param filters The record of filter keys to their selected values.
   */
  private updateFilterMetadata(filters: Record<string, any>): void {
    let count = 0;
    const lines: string[] = [];

    for (const [key, val] of Object.entries(filters)) {
      if (val === null || val === undefined || val === '') continue;
      if (Array.isArray(val) && val.length === 0) continue;

      count++;
      const display = Array.isArray(val)
        ? val.map((v) => (typeof v === 'object' ? (v as any)?.nameEn ?? JSON.stringify(v) : v)).join(', ')
        : typeof val === 'object'
          ? (val as any)?.nameEn ?? JSON.stringify(val)
          : String(val);
      lines.push(`${key}: ${display}`);
    }

    this.filterCount.set(count);
    this.filterTooltip.set(lines.join('\n'));
  }

  // ── Data Fetching ──────────────────────────────────────────────────────────

  /**
   * Fetches the full unpaginated dataset for client-side mode.
   * Uses GET or POST based on the `apiMethod` input.
   */
  private fetchClientData(): void {
    this.loading.set(true);
    const url = this.apiUrl();
    const obs =
      this.apiMethod() === 'POST'
        ? this.gridService.fetchClientDataPost(url)
        : this.gridService.fetchClientDataGet(url);

    this.subscriptions.add(
      obs.subscribe({
        next: (res: GridResponse) => {
          this.tableData.set(res.data.data ?? []);
          this.totalRecords.set(res.data.listCount ?? res.data.data?.length ?? 0);
          this.loading.set(false);
          this.dataLoaded.emit(res.data.data ?? []);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }

  /**
   * Fetches paginated data for lazy (server-side) mode.
   * Plugs the active filters, global search, and pagination settings into the payload.
   */
  private fetchLazyData(): void {
    this.loading.set(true);
    const payload: GridPayload = {
      isSearchFilter: this.filterCount() > 0,
      searchKey: this.globalSearchValue(),
      search: this.activeFilters(),
      pageSize: this.pageSize(),
      pageNumber: this.currentPage(),
    };

    this.subscriptions.add(
      this.gridService.fetchLazyData(this.apiUrl(), payload).subscribe({
        next: (res: GridResponse) => {
          this.tableData.set(res.data.data ?? []);
          this.totalRecords.set(res.data.listCount ?? 0);
          this.loading.set(false);
          this.dataLoaded.emit(res.data.data ?? []);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }

  // ── Pagination ─────────────────────────────────────────────────────────────

  /**
   * Handled directly by table pager in client mode when the user navigates pages.
   */
  onPageChange(event: any): void {
    const newPage = Math.floor((event.first ?? 0) / (event.rows ?? this.pageSize()));
    this.currentPage.set(newPage);
    this.first.set(event.first ?? 0);
    // Removed fetchLazyData() here because onLazyLoad covers lazy loading page changes
  }

  /**
   * Triggered by PrimeNG Table when page, sort, or filter changes in lazy mode.
   * We intercept this to sync our internal signals and fire fetchLazyData().
   */
  onLazyLoad(event: TableLazyLoadEvent): void {
    const newPage = Math.floor((event.first ?? 0) / (event.rows ?? this.pageSize()));
    this.currentPage.set(newPage);
    this.first.set(event.first ?? 0);

    if (this.mode() === 'lazy') {
      this.fetchLazyData();
    }
  }

  // ── Global Search ──────────────────────────────────────────────────────────

  onGlobalSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.globalSearchValue.set(value);
    this.searchSubject.next(value);
  }

  private onGlobalSearchDebounced(searchKey: string): void {
    // Reset filters when using global search
    this.activeFilters.set({});
    this.filterCount.set(0);
    this.filterTooltip.set('');
    this.currentPage.set(0);

    if (this.mode() === 'lazy') {
      if (this.first() !== 0) {
        this.first.set(0); // This automatically triggers onLazyLoad in PrimeNG DataView/Table
      } else {
        this.fetchLazyData(); // Already on page 0, trigger fetch manually
      }
    }
    // For client mode with API, re-fetch is not needed as search is done via server
    // But if the consumer wants client-side filtering they can listen to dataLoaded
  }

  // ── Filters & Search ───────────────────────────────────────────────────────

  /**
   * Applies the filters returned by the popover panel.
   * Updates local storage, syncs metadata, resets pagination, and re-fetches.
   *
   * @param filters The new set of selected filter values.
   */
  onApplyFilters(filters: Record<string, any>): void {
    this.activeFilters.set(filters);
    this.globalSearchValue.set('');
    this.currentPage.set(0);
    this.first.set(0);

    // Save to local storage
    if (this.moduleName()) {
      localStorage.setItem(`${this.moduleName()}_filters`, JSON.stringify(filters));
    }

    // Update metadata (badges, tooltips)
    this.updateFilterMetadata(filters);

    if (this.mode() === 'lazy') {
      if (this.first() !== 0) {
        this.first.set(0); // Triggers onLazyLoad automatically
      } else {
        this.fetchLazyData();
      }
    }
  }

  /**
   * Resets all filters to baseline. Clears local storage and re-fetches all data.
   */
  onResetFilters(): void {
    this.activeFilters.set({});
    this.filterCount.set(0);
    this.filterTooltip.set('');

    // Clear local storage
    if (this.moduleName()) {
      localStorage.removeItem(`${this.moduleName()}_filters`);
    }

    if (this.mode() === 'lazy') {
      if (this.first() !== 0) {
        this.first.set(0); // Triggers onLazyLoad automatically
      } else {
        this.fetchLazyData();
      }
    } else if (this.mode() === 'client' && this.apiUrl()) {
      this.fetchClientData();
    }
  }

  // ── Column Helpers ─────────────────────────────────────────────────────────

  isSimpleField(col: ColumnsInterface): boolean {
    return typeof col.field === 'string';
  }

  getFieldValue(row: any, col: ColumnsInterface): string {
    if (typeof col.field === 'string') {
      return row[col.field] ?? '';
    }
    return '';
  }

  getMultiLabelFields(col: ColumnsInterface): FieldLabel[] {
    if (Array.isArray(col.field)) {
      return col.field as FieldLabel[];
    }
    return [];
  }

  getFieldLabelValue(row: any, fieldLabel: FieldLabel): string {
    return row[fieldLabel.label] ?? '';
  }

  getTagsList(row: any, col: ColumnsInterface): string[] {
    if (typeof col.field === 'string') {
      const val = row[col.field];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split(',').map((s: string) => s.trim());
    }
    return [];
  }

  onCellClick(row: any, col: ColumnsInterface): void {
    if (col.action) {
      col.action(row);
    }
  }

  // ── Permissions ────────────────────────────────────────────────────────────

  /**
   * Evaluates whether the currently authenticated user has the designated permission.
   * Cascades through explicit permission checking, 'auth_user' object permissions,
   * and directly stored array of permissions matching `moduleName`.
   *
   * @param actionCheck Name of the action, usually short like 'edit' or 'delete'.
   * @param explicitPermission Complete string of permission if custom logic applies.
   * @returns Boolean indicating authorization.
   */
  hasPermission(actionCheck: string, explicitPermission?: string): boolean {
    if (explicitPermission) {
      actionCheck = explicitPermission;
    } else {
      actionCheck = actionCheck.replace(/\s+/g, '').toLowerCase();
    }

    // Bypass check if there's no moduleName context provided
    if (!this.moduleName() && !explicitPermission) {
      return true; // No permission required
    }

    let perms: string[] = [];
    try {
      // 1. Try to get from auth_user
      const userJson = localStorage.getItem('auth_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user && user.permissions) {
          perms = user.permissions;
        }
      }
      
      // 2. Try to get from local storage by module name directly
      if ((!perms || !perms.length) && this.moduleName()) {
        const modulePerms = localStorage.getItem(this.moduleName()!);
        if (modulePerms) {
          perms = JSON.parse(modulePerms);
        }
      }
    } catch (e) {}

    if (!perms || !Array.isArray(perms) || perms.length === 0) {
      return false; 
    }

    const check1 = actionCheck.toLowerCase();
    const check2 = this.moduleName() ? `${this.moduleName()!.toLowerCase()}_${check1}` : '';
    
    return perms.some(p => {
       const pLower = p.toLowerCase();
       return pLower === check1 || (check2 && pLower === check2);
    });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  getVisibleActions(row: any): ActionsInterface[] {
    return this.actions().filter((action) => {
      // 1. Custom validation on the row level
      if (action.customPermission && !action.customPermission(row)) {
        return false;
      }
      // 2. String-based permission check from Auth
      const actionName = action.permission || action.name || (action.isEdit ? 'edit' : action.isDelete ? 'delete' : action.isBlock ? 'block' : '');
      if (actionName && !this.hasPermission(actionName, action.permission)) {
        return false;
      }
      return true;
    });
  }

  getActionLabel(action: ActionsInterface): string {
    if (action.isEdit) return 'Edit';
    if (action.isDelete) return 'Delete';
    if (action.isBlock) return 'Block';
    return action.name ?? '';
  }

  getActionIcon(action: ActionsInterface): string {
    if (action.isEdit) return 'pi pi-pencil';
    if (action.isDelete) return 'pi pi-trash';
    if (action.isBlock) return 'pi pi-ban';
    return action.icon ?? 'pi pi-cog';
  }

  onActionClick(action: ActionsInterface, row: any): void {
    if (action.call) {
      action.call(row);
    }
    this.activeActionRow.set(null);
  }

  toggleActionMenu(event: Event, row: any, popover: any): void {
    this.activeActionRow.set(row);
    popover.toggle(event);
  }
}
