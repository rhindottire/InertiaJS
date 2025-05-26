import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

import Checkbox from '@/components/elements/checkbox';
import { DataTableColumnHeader } from '@/components/templates/data-table-header';
import { DeleteModal } from '@/components/templates/delete-modal';
import { RestoreButton } from '@/components/templates/restore-button';
import { EditButton } from '@/components/templates/edit-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<User, string>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox 
        checked={row.getIsSelected()} 
        onCheckedChange={(value) => row.toggleSelected(!!value)} 
        aria-label="Select row" 
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const getInitials = useInitials();
      const username = row.getValue('username') as string;
      const avatar = row.getValue('avatar') as string | undefined;
      
      return (
        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
          <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Username" />,
    cell: ({ row }) => <div>{row.getValue('username')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Email" />,
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'default';
      
      switch (role) {
        case 'ADMIN':
          variant = 'destructive';
          break;
        case 'COURIER':
          variant = 'secondary';
          break;
        case 'CLIENT':
          variant = 'outline';
          break;
        default:
          variant = 'default';
          break;
      }
      return <Badge variant={variant}>{role}</Badge>;
    },
  },
  {
    accessorKey: 'deleted_at',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Status" />,
    cell: ({ row }) => {
      const deletedAt = row.getValue('deleted_at') as string | null;
      
      if (deletedAt) {
        return (
          <Badge variant="destructive" className="text-white">
            Deleted
          </Badge>
        );
      }
      
      return (
        <Badge variant="default" className="bg-green-500 text-white">
          Active
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      const isDeleted = !!user.deleted_at;
      
      return (
        <div className="flex gap-2">
          {!isDeleted && <EditButton endpoint="user" id={String(user.id)} />}
          {isDeleted ? (
            <RestoreButton resourceName="user" id={user.id} />
          ) : (
            <DeleteModal resourceName="user" id={user.id} />
          )}
        </div>
      );
    },
  },
];