export type Role = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'author' | 'user' | 'editor';
};

export type RoleAllResponse = {
  success: boolean;
  message: string;
  data: Role[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
};
