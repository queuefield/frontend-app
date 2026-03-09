import {
  Component,
  input,
  output,
  signal,
  inject,
  OnInit,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

import {
  SearchInterface,
  SearchInputTypes,
  ChoiceDropdownPayload,
} from '../../../models/grid.model';
import { GridService } from '../../../services/grid.service';

@Component({
  selector: 'app-grid-search-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    AutoCompleteModule,
    DatePickerModule,
    ButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid-search-panel.component.html',
  styleUrl: './grid-search-panel.component.scss',
})
export class GridSearchPanelComponent implements OnInit {
  // ── Inputs / Outputs ───────────────────────────────────────────────────────
  readonly filters = input.required<SearchInterface[]>();
  readonly initialFilters = input<Record<string, any>>({});
  readonly applyFilters = output<Record<string, any>>();
  readonly resetFilters = output<void>();
  readonly closePanel = output<void>();

  // ── Internal State ─────────────────────────────────────────────────────────
  searchValues = signal<Record<string, any>>({});
  dropdownOptions = signal<Record<string, any[]>>({});
  choiceSuggestions = signal<Record<string, any[]>>({});

  /** Show extra (non-fixed) filters */
  showMore = signal(false);

  readonly SearchInputTypes = SearchInputTypes;

  private gridService = inject(GridService);

  // ── Computed ────────────────────────────────────────────────────────────────
  fixedFilters = computed(() => this.filters().filter((f) => f.isFixed));
  extraFilters = computed(() => this.filters().filter((f) => !f.isFixed));

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.initSearchValues();
    // Options will be loaded when the panel is opened via onPanelOpen()
  }

  private optionsLoaded = false;

  /**
   * Called when the filter popover is opened.
   * Loads options only once.
   */
  public onPanelOpen(): void {
    if (!this.optionsLoaded) {
      this.loadDropdownOptions();
      this.optionsLoaded = true;
    }
  }

  private initSearchValues(ignoreInitialFilters: boolean = false): void {
    const vals: Record<string, any> = {};
    const existing = ignoreInitialFilters ? null : this.initialFilters();

    for (const f of this.filters()) {
      if (existing && existing[f.field] !== undefined) {
        // Use existing saved value
        // Note: For dates, we might need to cast strings back to Date objects
        if (f.type === SearchInputTypes.date && existing[f.field]) {
          const storedDate = existing[f.field];
          if (Array.isArray(storedDate)) {
             vals[f.field] = storedDate.map(d => d ? new Date(d) : null);
          } else {
             vals[f.field] = new Date(storedDate);
          }
        } else {
          vals[f.field] = existing[f.field];
        }
      } else {
        // Default blank value
        if (f.type === SearchInputTypes.date) {
          vals[f.field] = null;
        } else if (f.isMultiple) {
          vals[f.field] = [];
        } else if (f.type === SearchInputTypes.text) {
          vals[f.field] = '';
        } else {
          vals[f.field] = null;
        }
      }
    }
    this.searchValues.set(vals);
  }

  /**
   * Pre-load options for `select` filters that have a URL.
   */
  private loadDropdownOptions(): void {
    for (const f of this.filters()) {
      if (f.type === SearchInputTypes.select && f.url) {
        this.gridService
          .fetchDropdownOptions(f.url, f.method, f.params)
          .subscribe({
            next: (res: any) => {
              const list = Array.isArray(res) ? res : res?.list ?? res?.data ?? [];
              this.dropdownOptions.update((prev) => ({
                ...prev,
                [f.field]: list,
              }));
            },
          });
      }
      // For select with inline data
      if (f.type === SearchInputTypes.select && f.data) {
        this.dropdownOptions.update((prev) => ({
          ...prev,
          [f.field]: f.data!,
        }));
      }
    }
  }

  // ── Choice (AutoComplete) search ──────────────────────────────────────────
  onChoiceSearch(event: any, filter: SearchInterface): void {
    const query = event.query ?? '';
    const selectedIds = this.getSelectedChoiceIds(filter.field);
    const payload: ChoiceDropdownPayload = {
      selectedId: selectedIds,
      pageNumber: 0,
      searchCriteria: query,
      pageSize: 10,
    };
    if (filter.url) {
      this.gridService.fetchChoiceOptions(filter.url, payload).subscribe({
        next: (res: any) => {
          const list = Array.isArray(res) ? res : res?.list ?? res?.data ?? [];
          this.choiceSuggestions.update((prev) => ({
            ...prev,
            [filter.field]: list,
          }));
        },
      });
    }
  }

  private getSelectedChoiceIds(field: string): any[] {
    const val = this.searchValues()[field];
    if (!val) return [];
    if (Array.isArray(val)) return val.map((v: any) => v?.id ?? v);
    return [val?.id ?? val];
  }

  // ── Value helpers ──────────────────────────────────────────────────────────
  getOptionLabel(filter: SearchInterface): string {
    return 'nameEn';
  }

  getOptionValue(filter: SearchInterface): string {
    return filter.propValueName ?? 'id';
  }

  updateValue(field: string, value: any): void {
    this.searchValues.update((prev) => ({ ...prev, [field]: value }));
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  onApply(): void {
    const cleanValues = this.buildSearchObject();
    this.applyFilters.emit(cleanValues);
    this.closePanel.emit();
  }

  onReset(): void {
    this.initSearchValues(true);
    this.resetFilters.emit();
  }

  toggleMore(): void {
    this.showMore.update((v) => !v);
  }

  /**
   * Build the search object, only including fields that have values.
   */
  private buildSearchObject(): Record<string, any> {
    const result: Record<string, any> = {};
    const vals = this.searchValues();
    for (const f of this.filters()) {
      const v = vals[f.field];
      if (v === null || v === undefined || v === '') continue;
      if (Array.isArray(v) && v.length === 0) continue;
      result[f.field] = v;
    }
    return result;
  }
}
