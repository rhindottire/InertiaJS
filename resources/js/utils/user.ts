import { ROLE_MAP, STATUS_MAP } from '@/constants/user';
import { RoleConfig, StatusConfig } from '@/types';

export const getRoleConfig = (role: string): RoleConfig => {
  const key = role.toLowerCase();
  return (
    ROLE_MAP[key] ?? {
      label: role,
      variant: 'muted',
      icon: undefined,
    }
  );
};

export const getStatusConfig = (status: string): StatusConfig => {
  const key = status.toLowerCase();
  return (
    STATUS_MAP[key] ?? {
      label: status,
      variant: 'muted',
    }
  );
};


export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
