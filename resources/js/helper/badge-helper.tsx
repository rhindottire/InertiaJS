import { Badge } from '@/components/ui/badge';
import { getRoleConfig, getStatusConfig } from '@/utils/user';

export const getRoleBadgeConfig = (role: string) => {
  const { label, variant, icon: Icon } = getRoleConfig(role);

  return (
    <Badge variant={variant} className="ml-2">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
};

export const getStatusBadgeConfig = (status: string) => {
  const { label, variant, icon: Icon } = getStatusConfig(status);

  return (
    <Badge variant={variant} className="ml-2">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
};

