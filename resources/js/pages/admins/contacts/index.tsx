import { toast } from 'sonner';
import { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { BreadcrumbItem, Contact, SharedData } from '@/types';

import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/components/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [{
  title: 'Contacts',
  href: '/admin/contacts',
}];

interface ContactsPageProps extends SharedData {
  contacts: { data: Contact[] };
  filters: Record<string, string | undefined>;
}

export default function Contacts() {
  const { contacts, filters, success, error } = usePage<ContactsPageProps>().props;

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Contacts Management" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contacts Management</h1>
            <p className="text-muted-foreground">
              Manage user contact information. Click on user links to navigate to the user management page.
            </p>
          </div>
          
          <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
            <DataTable<Contact, string>
              columns={columns}
              data={contacts.data}
              create="contact"
              filters={filters}
              resourceName="contact"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}