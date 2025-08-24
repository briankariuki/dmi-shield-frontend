export type DashboardGroup = {
  id?: string;
  name: string;
  description: string;
  dashboards?: Dashboard[];
};

export type Dashboard = {
  id?: string;
  name: string;
  description: string;
  dashboard_id: string;
  superset_domain: string;
  group_id?: string;
  user_id?: string;
  roles: string[];
  status?: string;
  embed_token?: string;
  published_at?: Date;
  dashboard_group?: DashboardGroup;
};
