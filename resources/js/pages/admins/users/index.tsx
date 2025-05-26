import { BreadcrumbItem, SharedData, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import AppLayout from '@/components/layouts/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/admin/users',
  },
];

interface UsersPageProps extends SharedData {
  users: { data: User[] };
  filters: Record<string, string | undefined>;
  highlight: string;
}

export default function Users() {
  const { users, filters, success, error, highlight } = usePage<UsersPageProps>().props;
  
  useEffect(() => {
    console.log('Props highlight:', highlight);
  }, [highlight]);

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users Management" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions. You can filter by role, status, and restore deleted users.
            </p>
          </div>

          <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
            <DataTable<User, string>
              columns={columns}
              data={users.data}
              create="user"
              filters={filters}
              resourceName="user"
              highlightRowId={highlight}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
