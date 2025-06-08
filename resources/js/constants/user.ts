import type { Role, Status } from '@/types';
import { CheckCircle, Shield, Truck, UserIcon, XCircle } from 'lucide-react';

export const ROLE_CONFIG: Record<Role, {
  label: string
  icon: React.ElementType
  variant: string
}> = {
  ADMIN: {
    label: "Admin",
    icon: Shield,
    variant: "purple",
  },
  COURIER: {
    label: "Courier",
    icon: Truck,
    variant: "orange",
  },
  CLIENT: {
    label: "Client",
    icon: UserIcon,
    variant: "cyan",
  },
}
export const STATUS_CONFIG: Record<Status, {
  label: string
  icon: React.ElementType
  variant: string
}> = {
  ACTIVE: {
    label: "Active",
    icon: CheckCircle,
    variant: "success",
  },
  INACTIVE: {
    label: "Inactive",
    icon: XCircle,
    variant: "inactive",
  },
}

