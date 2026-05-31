export class ApiPagination {
  public page: number = 1;
  public rowsPerPage: number = 5;
  public rowsNumber: number = 0;
  public sortBy: string | null = null;
  public descending: boolean = false;

  constructor(init?: Partial<ApiPagination>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  mergePayload(payload: any): any {
    return {
      ...payload,
      page: this.page,
      rowsPerPage: this.rowsPerPage,
      sortBy: this.sortBy,
      descending: this.descending
    };
  }

  includeResult(meta: any): void {
    if (meta) {
      if (meta.totalRows !== undefined) {
        this.rowsNumber = meta.totalRows;
      } else if (meta.totalElements !== undefined) {
        this.rowsNumber = meta.totalElements;
      }
      if (meta.currentPage !== undefined) {
        this.page = meta.currentPage;
      }
    }
  }
}
