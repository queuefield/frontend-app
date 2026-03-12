/**
 * Shared Grid/List Component — Interfaces & Enums
 */

// ── Enums ────────────────────────────────────────────────────────────────────

export enum SearchInputTypes {
  text = 'text',
  select = 'select',
  choice = 'choice',
  date = 'date',
}

export enum HTTPMethods {
  getReq = 'getReq',
  postReq = 'postReq',
  postReqWithUrlHeader = 'postReqWithUrlHeader',
}

// ── Column Interfaces ────────────────────────────────────────────────────────

export interface FieldLabel {
  label: string;
  custom?: string; // e.g. 'navigator', 'icon'
}

export interface ColumnsInterface {
  /** Simple string field name OR array of FieldLabel for multiLabel cells OR string[] for split */
  field: string | string[] | FieldLabel[];
  /** Translation key for column header */
  header: string;
  /** CSS width e.g. '130px' */
  width?: string;
  /** Custom cell renderer type: 'multiLabel' | 'tags' | 'split' | 'dateSplit' | 'statusTag' */
  customCell?: string;
  /** Lookup map for status string -> color dot hex/rgba (e.g. { 'Active': '#10b981' }) */
  statusMap?: Record<string, string>;
  /** Click action for the cell (e.g. navigate) */
  action?: (row: any) => void;
}

// ── Action Interfaces ────────────────────────────────────────────────────────

export interface ActionsInterface {
  name?: string;
  icon?: string;
  /** Permission key to check */
  permission?: string;
  /** Callback when action is clicked */
  call?: (row: any) => void;
  /** Dynamic permission check per row */
  customPermission?: (row: any) => boolean;
  /** Shorthand flags */
  isEdit?: boolean;
  isDelete?: boolean;
  isBlock?: boolean;
  /** Navigation support */
  redirectable?: boolean;
  redirectLink?: (row: any) => string;
  queryParams?: Record<string, any>;
}

// ── Options Interfaces ───────────────────────────────────────────────────────

export interface GridOptions {
  showView?: boolean;
  showAdd?: boolean;
  showExport?: boolean;
  [key: string]: any;
}

// ── Search / Filter Interfaces ───────────────────────────────────────────────

export interface SearchInterface {
  type: SearchInputTypes;
  /** The key in the search payload */
  field: string;
  /** Always visible in the filter panel */
  isFixed?: boolean;
  /** API URL to fetch dropdown options */
  url?: string;
  /** HTTP method for fetching options */
  method?: HTTPMethods;
  /** Allow multiple selections */
  isMultiple?: boolean;
  /** Choice type: use server-side pagination/search */
  serverSide?: boolean;
  /** Inline static data for select */
  data?: any[];
  /** Extra URL param (for postReqWithUrlHeader) */
  params?: string;
  /** Property name to use as the value (default: 'id') */
  propValueName?: string;
}

// ── Server-Side (Lazy) Payload ───────────────────────────────────────────────

export interface GridPayload {
  isSearchFilter: boolean;
  searchKey: string;
  search: Record<string, any>;
  pageSize: number;
  pageNumber: number;
}

// ── Choice Dropdown Payload ──────────────────────────────────────────────────

export interface ChoiceDropdownPayload {
  selectedId: any[];
  pageNumber: number;
  searchCriteria: string;
  pageSize: number;
}

// ── API Response Envelope ────────────────────────────────────────────────────

export interface GridResponse<T = any> {
  list?: T[];
  data?: any; // Supports nested res.data.data
  listCount?: number;
  totalRecords?: number;
  totalCount?: number;
  totalPages?: number;
  [key: string]: any;
}
