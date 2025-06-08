import { cn } from '@/lib/utils';
import * as React from 'react';

export default function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="dropdown-menu-shortcut" className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)} {...props} />;
}
