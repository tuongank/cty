export class ApiFilter {
  public filter?: string;

  constructor(filter?: string) {
    this.filter = filter;
  }

  mergePayload(payload: any): any {
    if (this.filter === undefined || this.filter === null) {
      return payload;
    }
    return {
      ...payload,
      filter: this.filter
    };
  }
}
