import { Button } from '@/components/elements/button';
import AppLayout from '@/components/layouts/app-layout';
import { CategoriesCard } from '@/components/templates/categories-card';
import { BreadcrumbItem, Category, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Categories',
    href: '/categories',
  },
];

export default function Categories() {
  const { categories, success, error } = usePage<
    SharedData & { categories: { data: Category[] } }
  >().props;

  console.log(categories);

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="categories" />
      <div className="flex items-center justify-between p-5">
        <div>
          <h1 className="text-2xl font-bold">Categories Topics</h1>
          <p className="text-gray-500">List of product items</p>
        </div>
        <Button asChild>
          <Link href={route('categories.create')}>
            <Plus />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 p-5">
        {categories.data.map((category) => (
          <CategoriesCard key={category.id} category={category} />
        ))}
      </div>
    </AppLayout>
  );
}