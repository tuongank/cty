import type {
  DistributionChartData,
  DistributionChartDataSet,
  DistributionType,
  TrendChartData,
  TrendChartDataSet,
  TrendChartType,
} from "./interface/chart.js";
export class TrendChartDataImpl implements TrendChartData {
  constructor(
    public readonly label: string,
    public readonly values: number[],
    public readonly unit: string | undefined = undefined,
    public readonly type: TrendChartType | undefined = undefined,
    public readonly borderColor: string | undefined = undefined,
    public readonly backgroundColor: string | undefined = undefined,
    public readonly yAxisID: string | undefined = undefined,
  ) {}
  public static fromResponse<T = TrendChartData>(res: TrendChartData): T {
    return new TrendChartDataImpl(res.label, res.values, res.unit) as T;
  }
}
export class TrendChartDataSetImpl<
  T = TrendChartData,
> implements TrendChartDataSet<T> {
  public readonly createdAt: number;
  /* timestamp */ constructor(
    public readonly columns: string[],
    public readonly rows: T[],
    createdAt: number | string = -1,
  ) {
    if (createdAt === -1) {
      this.createdAt = Date.now();
      return;
    }
    if (typeof createdAt === "number") {
      this.createdAt = createdAt;
      return;
    }
    const numberParsed = Number(createdAt);
    if (!isNaN(numberParsed)) {
      this.createdAt = numberParsed;
      return;
    }
    const dateTimeStringParse = Date.parse(createdAt);
    if (dateTimeStringParse) {
      this.createdAt = dateTimeStringParse;
      return;
    }
    this.createdAt = Date.now();
  }
  public static fromResponse<T = TrendChartData>(
    res: any,
  ): TrendChartDataSet<T> {
    return new TrendChartDataSetImpl<T>(
      res.columns,
      res.rows.map((e: any) => TrendChartDataImpl.fromResponse<T>(e)),
    );
  }
}
export class DistributionChartDataImpl implements DistributionChartData {
  constructor(
    public readonly label: string,
    public readonly value: number,
    public readonly unit: string | undefined = undefined,
    public readonly borderColor: string | undefined = undefined,
    public readonly backgroundColor: string | undefined = undefined,
  ) {}
  public static fromResponse(
    res: DistributionChartData,
  ): DistributionChartData {
    return new DistributionChartDataImpl(res.label, res.value, res.unit);
  }
}
export class DistributionChartDataSetImpl implements DistributionChartDataSet {
  public createdAt: number;
  public type: DistributionType | undefined;
  constructor(
    public readonly rows: DistributionChartData[],
    createdAt: number | string = -1,
    type: DistributionType | undefined = undefined,
  ) {
    this.type = type;
    if (createdAt === -1) {
      this.createdAt = Date.now();
      return;
    }
    if (typeof createdAt === "number") {
      this.createdAt = createdAt;
      return;
    }
    const numberParsed = Number(createdAt);
    if (!isNaN(numberParsed)) {
      this.createdAt = numberParsed;
      return;
    }
    const dateTimeStringParse = Date.parse(createdAt);
    if (dateTimeStringParse) {
      this.createdAt = dateTimeStringParse;
      return;
    }
    this.createdAt = Date.now();
  }
  public static fromResponse(
    res: DistributionChartDataSet,
  ): DistributionChartDataSetImpl {
    return new DistributionChartDataSetImpl(
      res.rows.map((e: DistributionChartData) =>
        DistributionChartDataImpl.fromResponse(e),
      ),
    );
  }
}
