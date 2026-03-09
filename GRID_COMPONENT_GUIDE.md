# Shared Grid/List Component — Usage Guide

A reusable, configurable data grid built on **PrimeNG Table** for Angular 21. Supports **client-side** and **server-side (lazy)** data loading, a rich filter panel, global search with debounce, row action menus, and PrimeNG paginator.

---

## Quick Start

Import the component in any standalone component:

```typescript
import { GridListComponent } from '../shared/grid-list/grid-list.component';
import { ColumnsInterface, ActionsInterface, SearchInterface, SearchInputTypes } from '../../models/grid.model';

@Component({
  imports: [GridListComponent],
  template: `
    <app-grid-list
      [mode]="'client'"
      [data]="myData"
      [columns]="columns"
      [actions]="actions"
      [filters]="filters"
      [pageSize]="10"
      title="My Module"
    />
  `,
})
export class MyPageComponent { ... }
```

---

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `mode` | `'client' \| 'lazy'` | `'client'` | Data loading strategy |
| `data` | `any[]` | `[]` | Direct data (client mode only) |
| `apiUrl` | `string` | `''` | API endpoint for fetching data |
| `apiMethod` | `'GET' \| 'POST'` | `'GET'` | HTTP method for client-side API fetch |
| `columns` | `ColumnsInterface[]` | *required* | Column definitions |
| `actions` | `ActionsInterface[]` | `[]` | Row action definitions |
| `filters` | `SearchInterface[]` | `[]` | Filter definitions for search panel |
| `pageSize` | `number` | `10` | Rows per page |
| `rowsPerPageOptions` | `number[]` | `[5,10,25,50]` | Paginator options |
| `globalSearchPlaceholder` | `string` | `'Search...'` | Global search placeholder |
| `title` | `string` | `''` | Grid title |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `dataLoaded` | `any[]` | Emitted when data is loaded |

---

## Data Modes

### 1. Client-Side with Direct Data

```typescript
<app-grid-list
  [mode]="'client'"
  [data]="myArray"
  [columns]="columns"
/>
```

### 2. Client-Side with API URL

Fetches all data at once from an API.

```typescript
<app-grid-list
  [mode]="'client'"
  [apiUrl]="'/api/customers/all'"
  [apiMethod]="'POST'"
  [columns]="columns"
/>
```

**Expected API response:**
```json
{
  "list": [...],
  "listCount": 100,
  "totalPages": 10
}
```

### 3. Server-Side (Lazy) Mode

Sends a POST request on every page change / filter change.

```typescript
<app-grid-list
  [mode]="'lazy'"
  [apiUrl]="'/api/customers/list'"
  [columns]="columns"
  [filters]="filters"
  [pageSize]="10"
/>
```

**POST payload sent by the grid:**
```json
{
  "isSearchFilter": false,
  "searchKey": "",
  "search": {},
  "pageSize": 10,
  "pageNumber": 0
}
```

- `pageNumber` starts at `0`, increments on each page
- `isSearchFilter` is `true` when filter panel search is active
- `searchKey` holds the global search value
- `search` holds the filter panel values

---

## Column Definitions

```typescript
columns: ColumnsInterface[] = [
  // Simple text column
  { field: 'dolphinId', header: 'Dolphin ID', width: '130px' },

  // Multi-label column (two fields stacked)
  {
    field: [
      { label: 'nameEn', custom: 'navigator' },
      { label: 'nameAr', custom: 'icon' },
    ],
    header: 'Customer Name',
    customCell: 'multiLabel',
    action: (row) => this.navigate(row),
    width: '220px',
  },

  // Tags column (renders as colored chips)
  {
    field: 'tagsNamesEn',
    header: 'Tags',
    customCell: 'tags',
    width: '140px',
  },
];
```

### Custom Cell Types

| `customCell` | Behavior |
|---|---|
| *(empty)* | Plain text from `row[field]` |
| `'multiLabel'` | Stacked labels from `field[]` array, with `navigator`/`icon` styling |
| `'tags'` | Array or comma-separated string rendered as PrimeNG Tag chips |

---

## Action Definitions

```typescript
actions: ActionsInterface[] = [
  // Shorthand actions
  { isEdit: true, call: (row) => this.edit(row) },
  { isDelete: true, call: (row) => this.delete(row) },
  { isBlock: true },

  // Custom actions
  {
    name: 'View History',
    icon: 'pi pi-history',
    permission: 'viewhistory',
    call: (row) => this.viewHistory(row),
  },

  // Conditional visibility per row
  {
    name: 'Complete Data',
    icon: 'pi pi-pencil',
    permission: 'completedata',
    customPermission: (row) => row.statusId === 1 || row.statusId === 2,
    call: (row) => this.complete(row),
  },
];
```

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Display label |
| `icon` | `string` | PrimeIcon class (e.g. `'pi pi-pencil'`) |
| `permission` | `string` | Permission key for access control |
| `call` | `(row) => void` | Callback when clicked |
| `customPermission` | `(row) => boolean` | Dynamic per-row visibility |
| `isEdit` / `isDelete` / `isBlock` | `boolean` | Shorthand preset actions |
| `redirectable` | `boolean` | If true, action supports navigation |
| `redirectLink` | `(row) => string` | Route path for navigation |
| `queryParams` | `Record<string, any>` | Query params for navigation |

---

## Filter Definitions (Search Panel)

```typescript
filters: SearchInterface[] = [
  // Text input
  { type: SearchInputTypes.text, field: 'dolphinId', isFixed: true },

  // Multi-select dropdown (inline data)
  {
    type: SearchInputTypes.select,
    field: 'status',
    isFixed: true,
    isMultiple: true,
    data: [
      { id: 1, nameEn: 'Active' },
      { id: 2, nameEn: 'Pending' },
    ],
  },

  // Multi-select dropdown (fetched from API)
  {
    type: SearchInputTypes.select,
    field: 'branch',
    isFixed: true,
    isMultiple: true,
    url: '/api/branches/all',
    method: HTTPMethods.getReq,
  },

  // Server-side autocomplete search (choice)
  {
    type: SearchInputTypes.choice,
    field: 'salesMan',
    isFixed: true,
    isMultiple: true,
    url: '/api/employees/dropdown',
    serverSide: true,
  },

  // Date range picker
  { type: SearchInputTypes.date, field: 'createdOn', isFixed: false },
];
```

### Filter Types

| `type` | PrimeNG Control | Notes |
|---|---|---|
| `text` | InputText | Simple text input |
| `select` | Select / MultiSelect | Based on `isMultiple`. Options from `data` or `url` |
| `choice` | AutoComplete | Server-side search. POST to `url` with `ChoiceDropdownPayload` |
| `date` | DatePicker (range) | Date range selection |

### `isFixed` Flag

- `isFixed: true` → Always visible in filter panel
- `isFixed: false` → Hidden under "More Filters" toggle

### Choice API Payload

```json
{
  "selectedId": [],
  "pageNumber": 0,
  "searchCriteria": "search term",
  "pageSize": 10
}
```

---

## Global Search

The global search input in the toolbar:
- Triggers API call after **1000ms debounce**
- Resets any active filters and tooltip
- Sets `isSearchFilter: false` and puts the value in `searchKey`

---

## Behavior Summary

| Feature | Client Mode | Lazy Mode |
|---|---|---|
| Data source | `[data]` input or single API call | POST per page/filter |
| Pagination | Client-side | Server-side (increments `pageNumber`) |
| Filter panel | Emits filter values | Re-fetches with `search` payload |
| Global search | Sets `searchKey`, resets filters | Re-fetches with `searchKey` |
| Actions | Same | Same |

---

## File Structure

```
src/app/
├── models/
│   └── grid.model.ts          # All interfaces & enums
├── services/
│   └── grid.service.ts        # HTTP helpers for grid
└── components/
    └── shared/
        ├── grid-list/
        │   ├── grid-list.component.ts
        │   ├── grid-list.component.html
        │   └── grid-list.component.scss
        └── grid-search-panel/
            ├── grid-search-panel.component.ts
            ├── grid-search-panel.component.html
            └── grid-search-panel.component.scss
```
