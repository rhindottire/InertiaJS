import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
  user: User;
}

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

export interface BadgeConfig {
  label: string;
  variant: BadgeVariant;
  icon?: LucideIcon;
  description?: string;
}

export type RoleConfig = BadgeConfig;
export type StatusConfig = BadgeConfig;

export type Role = 'ADMIN' | 'COURIER' | 'CLIENT'
export type Status = 'ACTIVE' | 'INACTIVE'

export interface TabsItem {
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
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
  contacts: {
    data: Contact[];
  };
  [key: string]: unknown;
  ziggy: Config & { location: string };
  quote: { message: string; author: string };
}

export interface User {
  id: number;
  google_id: number;
  email: string;
  username: string;
  avatar?: string;
  role: string;
  status: string;
  deleted_at: Date | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface Contact {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  profile?: string;
  gender: 'MAN' | 'WOMAN';
  birthday: Date;
  favourite?: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  user: User;
  // addressess: Address[];
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
  deleted_at?: string | null;
  contact: Contact | null;
  [key: string]: unknown;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: number;
  category_id: number;
  name: string;
  unit: string;
  price: number;
  stock: number;
  image_url: string;
  is_available: boolean;
  description: string;
  discount: number;
  expired_at: date;
  created_at: string;
  updated_at: string;
}
