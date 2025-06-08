import { getRoleBadgeConfig, getStatusBadgeConfig } from '@/helper/badge-helper';
import type { User } from '@/types';
import { getInitials } from '@/utils/user';
import type { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, Trash2, Wifi, WifiOff } from 'lucide-react';

import Checkbox from '@/components/elements/checkbox';

import { DataTableColumnHeader } from '@/components/templates/data-table-header';
import { DeleteModal } from '@/components/templates/delete-modal';
import { EditButton } from '@/components/templates/edit-button';
import { RestoreModal } from '@/components/templates/restore-modal';
import { ShowButton } from '@/components/templates/show-button';

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
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      const user = row.original;
      const username = user.username;
      const avatar = user.avatar;
      const googleId = user.google_id;
      const imageSrc = googleId ? avatar : `/storage/${avatar}`;

      return (
        <Avatar className="border-border h-10 w-10 overflow-hidden rounded-full border-2">
          <AvatarImage src={imageSrc} alt={username} />
          <AvatarFallback className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Username" />,
    cell: ({ row }) => <div className="text-foreground font-medium">{row.getValue('username')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Email" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Role" />,
    cell: ({ row }) => getRoleBadgeConfig(row.getValue('role') as string),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Status" />,
    cell: ({ row }) => getStatusBadgeConfig(row.getValue('status') as string),
  },
  {
    accessorKey: 'remember_token',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Last Seen" />,
    cell: ({ row }) => {
      const rememberToken = row.getValue('remember_token');
      const isOnline = !!rememberToken;

      return (
        <Badge variant={isOnline ? 'online' : 'offline'} className="gap-1.5">
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Offline
            </>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Registered" />,
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string;
      if (!createdAt) return null;

      const formattedDate = format(new Date(createdAt), 'd MMMM yyyy');

      return (
        <Badge variant="info" className="gap-1.5">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Last Update" />,
    cell: ({ row }) => {
      const updatedAt = row.getValue('updated_at') as string;
      if (!updatedAt) return null;

      const lastUpdate = formatDistanceToNow(new Date(updatedAt), {
        addSuffix: true,
      });

      return (
        <Badge variant="warning" className="gap-1.5">
          <Clock className="h-3 w-3" />
          {lastUpdate}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'deleted_at',
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Deleted" />,
    cell: ({ row }) => {
      const deletedAt = row.getValue('deleted_at') as string;
      if (!deletedAt) return null;

      return (
        <Badge variant="destructive" className="gap-1.5">
          <Trash2 className="h-3 w-3" />
          Deleted
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
          {isDeleted ? (
            <>
              <ShowButton endpoint="user" id={String(user.id)} />
              <RestoreModal resourceName="user" id={user.id} />
            </>
          ) : (
            <>
              <EditButton endpoint="user" id={String(user.id)} />
              <DeleteModal resourceName="user" id={user.id} />
            </>
          )}
        </div>
      );
    },
  },
];
