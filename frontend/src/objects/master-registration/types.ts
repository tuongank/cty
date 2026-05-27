// Status options for registry tools
export const TOOL_STATUS = {
  ACTIVE: 'ACTIVE',
  MAINT: 'MAINT',
  STORAGE: 'STORAGE',
  REPAIR: 'REPAIR'
} as const;

export type ToolStatus = typeof TOOL_STATUS[keyof typeof TOOL_STATUS];

export const TOOL_STATUS_OPTIONS = [
  { label: 'Active', value: TOOL_STATUS.ACTIVE },
  { label: 'Maintenance', value: TOOL_STATUS.MAINT },
  { label: 'Storage', value: TOOL_STATUS.STORAGE },
  { label: 'Repair', value: TOOL_STATUS.REPAIR }
];

// Map status to CSS class
export const STATUS_CLASS_MAP: Record<string, string> = {
  [TOOL_STATUS.ACTIVE]: 'status-active',
  [TOOL_STATUS.MAINT]: 'status-maint',
  [TOOL_STATUS.STORAGE]: 'status-storage',
  [TOOL_STATUS.REPAIR]: 'status-repair'
};

// TypeScript Interfaces
export interface Category {
  id: number;
  category: string; // The response uses 'category' for name
}

export interface ToolType {
  id: number;
  categoryId: number;
  categoryName: string;
  typeCode: string;
}

export interface Registry {
  id: number;
  serialNumber: string;
  categoryId: number;
  categoryName: string;
  typeId: number;
  typeCode: string;
  location: string;
  status: string;
}

export interface PaginationState {
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
  sortBy?: string | null;
  descending?: boolean;
}

export interface RegistryResponse {
  data: Registry[];
  total: number;
}

// Table column definitions
export const CATEGORY_COLUMNS = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Category Name', field: 'category', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
] as any[];

export const TYPE_COLUMNS = [
  { name: 'category', label: 'Category', field: 'categoryName', align: 'left', sortable: true },
  { name: 'typeCode', label: 'Type Code', field: 'typeCode', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
] as any[];

export const REGISTRY_COLUMNS = [
  { name: 'serialNumber', label: 'Serial Number', field: 'serialNumber', align: 'left', sortable: true },
  { name: 'category', label: 'Category', field: 'categoryName', align: 'left', sortable: true },
  { name: 'type', label: 'Type', field: 'typeCode', align: 'left', sortable: true },
  { name: 'location', label: 'Zone / Loc', field: 'location', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
] as any[];
