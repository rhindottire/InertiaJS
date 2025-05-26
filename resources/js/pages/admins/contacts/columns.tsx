import { Contact } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

import Checkbox from '@/components/elements/checkbox';
import { DataTableColumnHeader } from '@/components/templates/data-table-header';
import { DeleteModal } from '@/components/templates/delete-modal';
import { EditButton } from '@/components/templates/edit-button';
import { CrossReferenceLink } from '@/components/templates/cross-reference-link';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Contact, string>[] = [
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
    accessorKey: 'user_id',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="User" />,
    cell: ({ row }) => {
      const userId = row.getValue('user_id') as number;
      const contact = row.original;
      
      // Type guard untuk memastikan user ada
      const user = 'user' in contact ? contact.user as { id: number; username: string; email: string } | undefined : undefined;
      
      return (
        <CrossReferenceLink 
          userId={userId}
          username={user?.username}
          email={user?.email}
        />
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Phone" />,
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Gender" />,
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string;
      return (
        <Badge variant={gender === 'MAN' ? 'default' : 'secondary'}>
          {gender}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'birthday',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Birthday" />,
    cell: ({ row }) => {
      const birthday = row.getValue('birthday') as string;
      return <div>{new Date(birthday).toLocaleDateString()}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="flex gap-2">
          <EditButton endpoint="contact" id={String(contact.id)} />
          <DeleteModal resourceName="contact" id={contact.id} />
        </div>
      );
    },
  },
];