export class ApiSorter {
  public sortBy?: string | null;
  public descending?: boolean;

  constructor(sortBy?: string | null, descending?: boolean) {
    this.sortBy = sortBy;
    this.descending = descending;
  }

  mergePayload(payload: any): any {
    return {
      ...payload,
      sortBy: this.sortBy,
      descending: this.descending
    };
  }
}
