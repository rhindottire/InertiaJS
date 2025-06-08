import { Badge } from '@/components/ui/badge';
import { SelectItem } from '@/components/ui/select';
import { ROLE_MAP, STATUS_MAP } from '@/constants/user';

export const getRoleSelectItems = () => {
  return Object.entries(ROLE_MAP).map(([key, config]) => (
    <SelectItem key={key} value={key.toUpperCase()}>
      <div className="flex items-center">
        {config.icon && <config.icon className={`mr-2 h-4 w-4 text-${config.variant}-500`} />}
        {config.label}
        {config.description && (
          <Badge variant={config.variant} className="ml-2">
            {config.description}
          </Badge>
        )}
      </div>
    </SelectItem>
  ));
};

export const getStatusSelectItems = () => {
  return Object.entries(STATUS_MAP).map(([key, config]) => (
    <SelectItem key={key} value={key.toUpperCase()}>
      <div className="flex items-center">
        {config.icon && <config.icon className={`mr-2 h-4 w-4 text-${config.variant}-500`} />}
        {config.label}
        {config.description && (
          <Badge variant={config.variant} className="ml-2">
            {config.description}
          </Badge>
        )}
      </div>
    </SelectItem>
  ));
};
