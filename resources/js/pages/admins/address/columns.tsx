import { Address } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

import Checkbox from '@/components/elements/checkbox';
import { DataTableColumnHeader } from '@/components/templates/data-table-header';
import { DeleteModal } from '@/components/templates/delete-modal';
import { EditButton } from '@/components/templates/edit-button';
import { CrossReferenceLink } from '@/components/templates/cross-reference-link';

export const columns: ColumnDef<Address, string>[] = [
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
    accessorKey: 'contact_id',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="Owner" />,
    cell: ({ row }) => {
      const address = row.original;
      
      // Type guard untuk memastikan contact dan user ada
      const contact = 'contact' in address ? address.contact as {
        id: number;
        name: string;
        user_id: number;
        user?: { id: number; username: string; email: string };
      } | undefined : undefined;
      
      if (!contact?.user) {
        return <div className="text-muted-foreground">No user data</div>;
      }
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{contact.name}</div>
          <CrossReferenceLink 
            userId={contact.user.id}
            username={contact.user.username}
            email={contact.user.email}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'post_code',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="Post Code" />,
    cell: ({ row }) => <div className="font-mono">{row.getValue('post_code')}</div>,
  },
  {
    accessorKey: 'country',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="Country" />,
    cell: ({ row }) => <div>{row.getValue('country')}</div>,
  },
  {
    accessorKey: 'province',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="Province" />,
    cell: ({ row }) => <div>{row.getValue('province')}</div>,
  },
  {
    accessorKey: 'city',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="City" />,
    cell: ({ row }) => <div>{row.getValue('city')}</div>,
  },
  {
    accessorKey: 'street',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="Street" />,
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue('street')}</div>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const address = row.original;
      return (
        <div className="flex gap-2">
          <EditButton endpoint="address" id={String(address.id)} />
          <DeleteModal resourceName="address" id={address.id} />
        </div>
      );
    },
  },
];