import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ActionsInterface, ColumnsInterface, HTTPMethods, SearchInputTypes, SearchInterface, GridOptions } from '../../models/grid.model';
import { GridListComponent } from '../shared/grid-list/grid-list.component';


@Component({
  selector: 'app-users',
  imports: [
    GridListComponent
  ],
  template: `
    <div class="demo-page">
      <app-grid-list
        [mode]="'lazy'"
        [apiUrl]="'SIMCard/GetAllSimCards'"
        [columns]="columns"
        [actions]="actions"
        [filters]="filters"
        [options]="gridOptions"
        moduleName="Users"
        (onAddAction)="onAdd()"
        (onExportAction)="onExport()"
        (onViewAction)="onView($event)"
        [pageSize]="10"
        title="SIM Cards"
        globalSearchPlaceholder="Search SIM cards..."
      />
    </div>
  `,
  styles: [
    `
    `,
  ],
})
export class UsersComponent implements OnInit {

  // ── Options ────────────────────────────────────────────────────────────────
  gridOptions: GridOptions = {
    showAdd: true,
    showView: true,
    showExport: true,
  };

  ngOnInit() {
    // Mock user permissions so the buttons appear during the component usage
    const mockUser = {
      permissions: ['Users_add', 'Users_view', 'Users_export', 'Users_changecustody', 'Users_updatesimcardstatus']
    };
    localStorage.setItem('Users', JSON.stringify(mockUser.permissions));
  }

  onAdd() {
    console.log('UsersComponent: Add action triggered');
  }

  onExport() {
    console.log('UsersComponent: Export action triggered');
  }

  onView(row: any) {
    console.log('UsersComponent: View action triggered for row', row);
  }

// ── Columns ────────────────────────────────────────────────────────────────
  public columns: ColumnsInterface[] = [
    {
      field: 'gsm',
      header: 'simCards.simCardGSM',
      width: '120px',
    },
    {
      field: 'providerSerial',
      header: 'simCards.providerSerial',
      width: '150px',
    },
    {
      field: 'contractNo',
      header: 'simCards.contractNo',
      width: '150px',
    },
    {
      field: 'provider',
      header: 'simCards.provider',
      width: '150px',
    },
    {
      field: 'statusName',
      header: 'simCards.status',
      width: '150px',
    },
    {
      field: 'ownerName',
      header: 'Owner',
      width: '120px',
    },
  ];

  // ── Filters ────────────────────────────────────────────────────────────────
  filters: SearchInterface[] = [
    {
      type: SearchInputTypes.text,
      field: 'simCardGSM',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'providerSerial',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'simCardSerial',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'imsi',
      isFixed: true,
    },
    {
      type: SearchInputTypes.select,
      field: 'status',
      isFixed: true,
      url: 'SIMCard/GetAllSimcardStatus',
      isMultiple: true,
      method: HTTPMethods.postReq,
    },
    {
      type: SearchInputTypes.choice,
      serverSide: true,
      field: 'customer',
      isFixed: true,
      url: 'Customer/GetAllCustomersDropDwonForWorkOrders',
      isMultiple: true,
    },
    {
      type: SearchInputTypes.choice,
      field: 'employee',
      isFixed: true,
      url: 'Employee/GetAllEmployeesIc',
      isMultiple: true,
      serverSide: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'id',
      isFixed: false,
    },
    {
      type: SearchInputTypes.choice,
      field: 'provider',
      isFixed: false,
      url: 'SIMCard/GetAllSimCardProvidersDropDown',
      isMultiple: true,
    },
    {
      type: SearchInputTypes.choice,
      field: 'contractNumber',
      isFixed: false,
      url: 'Device/GetAllContractsWithoutParentDropDown',
      isMultiple: true,
      serverSide: true,
    },
    {
      type: SearchInputTypes.choice,
      field: 'contractOwner',
      isFixed: false,
      url: 'SIMCard/GetSIMCardContactOwnerDropDown',
      isMultiple: true,
    },
    {
      type: SearchInputTypes.choice,
      field: 'contractType',
      isFixed: false,
      url: 'SIMCard/GetAllSIMCardContactTypesDropDown',
      isMultiple: true,
    },
    {
      type: SearchInputTypes.select,
      field: 'contractBundle',
      isFixed: false,
      url: 'SIMCard/GetSIMCardContactBundleDropDown',
      isMultiple: true,
    },
    {
      type: SearchInputTypes.choice,
      serverSide: true,
      field: 'contractCustomer',
      isFixed: false,
      url: 'Customer/GetAllCustomersDropDwonForWorkOrders',
      isMultiple: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'blocked',
      isFixed: false,
      data: [
        { id: 1, nameEn: 'Yes' },
        { id: 0, nameEn: 'No' },
      ],
    },
    {
      type: SearchInputTypes.text,
      field: 'deviceSerial',
      isFixed: false,
    },
    {
      type: SearchInputTypes.text,
      field: 'deviceImei',
      isFixed: false,
    },
    {
      type: SearchInputTypes.choice,
      field: 'modelType',
      isFixed: false,
      url: 'ModelType/ModelTypesWithoutNonStock',
      isMultiple: true,
      serverSide: true,
    },
    {
      type: SearchInputTypes.choice,
      field: 'deviceFirmware',
      isFixed: false,
      url: 'DeviceFirmware/dropdown',
      isMultiple: true,
      serverSide: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'externalDevice',
      isFixed: false,
      data: [
        { id: 1, nameEn: 'Yes' },
        { id: 0, nameEn: 'No' },
      ],
    },
    {
      type: SearchInputTypes.choice,
      field: 'warehouseOfDevice',
      isFixed: false,
      url: 'Transfer/GetAllWarehousesDropDown',
      isMultiple: true,
    },
    {
      type: SearchInputTypes.choice,
      field: 'employeeOfDevice',
      isFixed: false,
      url: 'Employee/GetAllEmployeesIc',
      isMultiple: true,
      serverSide: true,
    },
    {
      type: SearchInputTypes.choice,
      field: 'createdBy',
      isFixed: false,
      url: 'User/GetAllUsersDropDownAuto',
      isMultiple: true,
      serverSide: true,
    },
    {
      type: SearchInputTypes.date,
      field: 'createdOn',
      isFixed: false,
    },
    {
      type: SearchInputTypes.date,
      field: 'updateDate',
      isFixed: true,
    },
  ];

  // ── Actions ────────────────────────────────────────────────────────────────
  public actions: ActionsInterface[] = [
    {
      isBlock: true,
      call: (row: any) => console.log('Block SIM card:', row),
    },
    {
      isEdit: true,
      call: (row: any) => console.log('Edit SIM card:', row),
    },
    {
      name: 'History',
      icon: 'pi pi-history',
      redirectable: true,
      call: (row: any) => console.log('Go to history:', row),
    },
    {
      name: 'Change custody',
      icon: 'pi pi-arrows-h',
      permission: 'changecustody',
      call: (row: any) => console.log('Change custody:', row),
    },
    {
      name: 'Update Status',
      icon: 'pi pi-refresh',
      permission: 'updatesimcardstatus',
      call: (row: any) => console.log('Update status:', row),
    },
  ];
}

