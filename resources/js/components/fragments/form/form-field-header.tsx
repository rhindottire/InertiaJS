import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

export function FormFieldHeader({ title, icon }: { title: string; icon: LucideIcon }) {
  const Icon = icon;

  return (
    <header className="flex items-center gap-3">
      <Badge className="h-11 w-11 rounded-full" asChild>
        {Icon && <Icon className="h-10 w-10" />}
      </Badge>
      <h2 className="text-xl font-bold">{title}</h2>
    </header>
  );
}
