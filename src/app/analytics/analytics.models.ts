export interface AnalyticsStat {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  goodWhenDown?: boolean;
}

export interface CategorySlice {
  label: string;
  percentage: number;
}

export interface TrendSeries {
  label: string;
  data: number[];
  color: string;
}

export interface TrendData {
  labels: string[];
  series: TrendSeries[];
}

export interface BarChartData {
  label: string;
  value: number;
}

export interface PolicyRow {
  title: string;
  ministry: string;
  state: string;
  category: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Archived' | string;
  date: string;
}

export interface SchemeRow {
  rank: number;
  name: string;
  ministry: string;
  views: number;
  applications: number;
}

export interface SchemeUpdateRow {
  title: string;
  ministry: string;
  type: 'Update' | 'Notification' | 'New Scheme' | string;
  date: string;
  status: 'Active' | 'Pending' | 'Inactive' | string;
}
