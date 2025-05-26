import { type LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  href: string;
  title: string;
}

export interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
  isActive?: boolean;
  icon?: LucideIcon | null;
}

export interface SharedData {
  auth: Auth;
  name: string;
  [key: string]: unknown;
  ziggy: Config & { location: string };
  quote: { message: string; author: string };
}

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  role: string;
  status: string;
  deleted_at: Date | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface Contact {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  profile?: string;
  gender: 'MAN' | 'WOMAN';
  birthday: string;
  favourite?: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Extended data for cross-reference
  user?: {
    id: number;
    username: string;
    email: string;
  };
  [key: string]: unknown;
}

export interface Address {
  id: number;
  contact_id: number;
  post_code: string;
  country: string;
  province: string;
  city: string;
  street: string;
  more?: string;
  created_at: string;
  updated_at: string;
  // Extended data for cross-reference
  contact?: {
    id: number;
    name: string;
    user_id: number;
    user?: {
      id: number;
      username: string;
      email: string;
    };
  };
  [key: string]: unknown;
}

// Additional types for pagination and filtering
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface FilterOptions {
  role?: string;
  status?: string;
  deleted_status?: string;
  gender?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}