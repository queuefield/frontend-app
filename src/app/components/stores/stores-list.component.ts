import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionsInterface,
  ColumnsInterface,
  HTTPMethods,
  SearchInputTypes,
  SearchInterface,
  GridOptions,
} from '../../models/grid.model';
import { GridListComponent } from '../shared/grid-list/grid-list.component';
import { LookupsService, LookupType } from '../../services/lookups.service';

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [GridListComponent],
  template: `
    <div class="stores-page">
      <app-grid-list
        [mode]="'lazy'"
        [apiUrl]="'/api/v1/tenant/list'"
        [columns]="columns"
        [actions]="actions"
        [filters]="filters"
        [options]="gridOptions"
        moduleName="Stores"
        (onAddAction)="onAdd()"
        (onViewAction)="onView($event)"
        [pageSize]="10"
        title="Stores"
        globalSearchPlaceholder="Search stores..."
      />
    </div>
  `,
  styles: [
    `
      .stores-page {
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class StoresListComponent implements OnInit {
  constructor(
    private router: Router,
    private lookupsService: LookupsService,
  ) {}

  gridOptions: GridOptions = {
    showAdd: true,
    showView: true,
    showExport: false,
  };

  ngOnInit() {
    // Mock user permissions so the buttons appear during the component usage
    const mockUser = {
      permissions: ['Stores_add', 'Stores_view', 'Stores_export', 'Stores_edit', 'Stores_delete'],
    };
    localStorage.setItem('Stores', JSON.stringify(mockUser.permissions));
  }

  onAdd() {
    this.router.navigate(['/stores/add']);
  }

  onEdit(row: any) {
    this.router.navigate(['/stores/edit', row.id || row.storeId]);
  }

  onView(row: any) {
    this.router.navigate(['/stores/view', row.id || row.storeId]);
  }

  // ── Columns ────────────────────────────────────────────────────────────────
  public columns: ColumnsInterface[] = [
    { field: 'referenceId', header: 'Reference ID' },
    {
      field: ['storeNameEn', 'storeNameAr'],
      header: 'Store Name',
      customCell: 'split',
    },
    { field: ['sourceNameEn', 'sourceNameAr'], header: 'Source', customCell: 'split' },
    { field: 'createDate', header: 'Create date', customCell: 'dateSplit' },
    { field: 'salesmanName', header: 'Salesman' },
    { field: 'supportAgentName', header: 'Support Agent' },
    { field: ['countryNameEn', 'countryNameEn'], header: 'City/Zone', customCell: 'split' },
    {
      field: ['subscriptionPlanNameEn', 'subscriptionPlanNameAr'],
      header: 'Subscription/Plan',
      customCell: 'split',
    },
    {
      field: 'statusNameEn',
      header: 'Status',
      customCell: 'statusTag',
      statusMap: {
        New: '#000000', // black
        Active: '#10b981', // Green
        Inactive: '#9ca3af', // Gray
        Blocked: '#ef4444', // Red
      },
    },
  ];

  // ── Filters ────────────────────────────────────────────────────────────────
  filters: SearchInterface[] = [
    { type: SearchInputTypes.text, field: 'storeId', isFixed: true },
    { type: SearchInputTypes.text, field: 'storeNameAr', isFixed: true },
    { type: SearchInputTypes.text, field: 'storeNameEn', isFixed: true },
    {
      type: SearchInputTypes.select,
      field: 'categoryIds',
      isFixed: true,
      url: '/api/v1/tenant/categories',
      isMultiple: true,
    },
    {
      type: SearchInputTypes.select,
      field: 'statusIds',
      isFixed: true,
      url: '/api/v1/tenant/statues',
      isMultiple: true,
    },
    { type: SearchInputTypes.text, field: 'contactName', isFixed: true },
    { type: SearchInputTypes.text, field: 'contactPhone', isFixed: true },
    { type: SearchInputTypes.date, field: 'createDateFrom', isFixed: false },
    { type: SearchInputTypes.date, field: 'createDateTo', isFixed: false },
    { type: SearchInputTypes.date, field: 'lastUpdateDateFrom', isFixed: false },
    { type: SearchInputTypes.date, field: 'lastUpdateDateTo', isFixed: false },
    { type: SearchInputTypes.text, field: 'storeNameDropdown', isFixed: false },
    { type: SearchInputTypes.text, field: 'branchId', isFixed: false },
    {
      type: SearchInputTypes.select,
      field: 'sourceId',
      isFixed: false,
      url: '/api/v1/tenant/sources',
    },
    {
      type: SearchInputTypes.select,
      field: 'salesmanIds',
      isFixed: false,
      url: '/api/v1/user/sales',
      isMultiple: true,
    },
    {
      type: SearchInputTypes.select,
      field: 'supportAgentIds',
      isFixed: false,
      url: '/api/v1/user/support',
      isMultiple: true,
    },
    {
      type: SearchInputTypes.select,
      field: 'isMultiBranch',
      isFixed: false,
      data: [
        { id: true, nameEn: 'Yes' },
        { id: false, nameEn: 'No' },
      ],
    },
    { type: SearchInputTypes.text, field: 'orderCountFrom', isFixed: false },
    { type: SearchInputTypes.text, field: 'orderCountTo', isFixed: false },
  ];

  // ── Actions ────────────────────────────────────────────────────────────────
  public actions: ActionsInterface[] = [
    {
      isEdit: true,
      name: 'Edit',
      icon: 'pi pi-pencil',
      call: (row: any) => this.onEdit(row),
    },
  ];
}
