export type RocksRole =
  | "superadmin"
  | "admin"
  | "standarduser"
  | "client"
  | "hr"
  | "floormanager"
  | "finance"
  | "sales"
  | "contentwriter";

type BasicUserInfo = {
  employee_id: number;
  user_id: number;
  role_name: RocksRole;
  employee_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  ext?: string;
  full_name: string;
};

type ClientProject = {
  client_id: number;
  client_name: string;
  project_name: string;
  manager: BasicUserInfo;
};

export type LoginReturn = {
  user: BasicUserInfo & {
    active_projects: Array<ClientProject>;
    managers: Array<BasicUserInfo>;
    is_admin: boolean;
    email: string;
    avatar: string;
  };
};
