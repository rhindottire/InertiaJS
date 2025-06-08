import { getRoleBadgeConfig, getStatusBadgeConfig } from '@/helper/badge-helper';
import { useRequiredFieldNumber } from '@/hooks/use-required-field-number';
import type { BreadcrumbItem, SharedData, User as UserType } from '@/types';
import { getInitials } from '@/utils/user';
import { router, useForm, usePage } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { Activity, Calendar, ChevronLeft, Clock, LoaderCircle, Lock, Mail, Save, Shield, User } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/elements/button';
import Separator from '@/components/elements/separator';

import Card from '@/components/fragments/card/card';
import CardContent from '@/components/fragments/card/card-content';
import CardDescription from '@/components/fragments/card/card-description';
import CardFooter from '@/components/fragments/card/card-footer';
import CardHeader from '@/components/fragments/card/card-header';
import CardTitle from '@/components/fragments/card/card-title';

import FormFieldInput from '@/components/fragments/form/form-field-input';

import AppLayout from '@/components/layouts/app-layout';

import AvatarUploadField from '@/components/fragments/form/form-field-avatar';
import FormFieldOption from '@/components/fragments/form/form-field-option';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UsersEdit() {
  const { user, success, error } = usePage<SharedData & { user: { data: UserType } }>().props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, setData, put, processing, errors, reset } = useForm({
    email: user.data.email || '',
    username: user.data.username || '',
    password: '',
    role: user.data.role || '',
    status: user.data.status || 'ACTIVE',
    avatar: user.data.avatar as string | null | File,
  });

  console.log(imagePreview);
  console.log(user.data.avatar);

  const [requiredFieldsNumber, setRequiredFieldsNumber] = useRequiredFieldNumber(data);

  const roleOptions = useMemo(
    () => [
      { value: 'ADMIN', label: 'Admin' },
      { value: 'COURIER', label: 'Courier' },
      { value: 'CLIENT', label: 'Client' },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    [],
  );

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Users',
      href: route('users.index'),
    },
    {
      title: 'Edit',
      href: route('users.edit', user.data.id),
    },
  ];

  const handleImageChange = (file: File | null) => {
    setData('avatar', file);
  };

  const handleRemoveImage = () => {
    setData('avatar', null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (data.avatar instanceof File) {
      const url = URL.createObjectURL(data.avatar);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof data.avatar === 'string' && data.avatar.length > 0) {
      setImagePreview(data.avatar);
    } else {
      setImagePreview(null);
    }
  }, [data.avatar]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    put(route('users.update', user.data.id), {
      onSuccess: () => {
        toast.success('User updated successfully');
        reset('password', 'role', 'email', 'username', 'avatar');
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Failed to update user');
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container px-4 py-8">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="border-border h-12 w-12 border-2">
                <AvatarImage src={user.data.avatar || '/placeholder.svg'} alt={user.data.username} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                  {getInitials(user.data.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">Edit User</CardTitle>
                <CardDescription className="mt-1">{user.data.username}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="bg-muted/20 border-b px-6 py-4">
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{user.data.created_at ? format(new Date(user.data.created_at), 'd MMMM yyyy') : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-medium">
                  {user.data.updated_at ? formatDistanceToNow(new Date(user.data.updated_at), { addSuffix: true }) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Current Role:</span>
                {getRoleBadgeConfig(user.data.role)}
              </div>
              <div className="flex items-center gap-2">
                <Activity className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Status:</span>
                {getStatusBadgeConfig(user.data.status)}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <section className="flex flex-col gap-2">
              <CardContent className="p-6">
                <section className="mt-4 flex-1 space-y-6 outline-none">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormFieldInput
                      label="Username"
                      htmlFor="username"
                      message={errors.username || ''}
                      value={data.username}
                      setValue={(value) => setData('username', value)}
                      icon={User}
                      required
                      onFilled={() => {
                        setRequiredFieldsNumber(requiredFieldsNumber + 1);
                      }}
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter username"
                      aria-invalid={errors.username ? 'true' : 'false'}
                      aria-describedby={errors.username ? 'username-error' : undefined}
                      className="w-full"
                    />

                    <FormFieldInput
                      label="Email"
                      htmlFor="email"
                      message={errors.email || ''}
                      value={data.email}
                      setValue={(value) => setData('email', value)}
                      icon={Mail}
                      required
                      onFilled={() => {
                        setRequiredFieldsNumber(requiredFieldsNumber + 1);
                      }}
                      id="email"
                      name="email"
                      type="text"
                      placeholder="Enter email"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className="space-y-2"
                    />

                    <FormFieldInput
                      label="New Password"
                      htmlFor="password"
                      type="password"
                      value={data.password}
                      message={errors.password || ''}
                      setValue={(value) => setData('password', value)}
                      icon={Lock}
                      // required
                      onFilled={() => {
                        setRequiredFieldsNumber(requiredFieldsNumber + 1);
                      }}
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      aria-invalid={errors.password ? 'true' : 'false'}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      className="space-y-2"
                    />

                    <AvatarUploadField
                      imagePreview={imagePreview}
                      onImageChange={handleImageChange}
                      onRemoveImage={handleRemoveImage}
                      username={data.username}
                      error={errors.avatar}
                    />

                    <FormFieldOption
                      label="Role"
                      htmlFor="role"
                      value={data.role}
                      setValue={(val) => setData('role', val)}
                      message={errors.role}
                      required
                      options={roleOptions}
                      badgeRenderer={getRoleBadgeConfig}
                      icon={Shield}
                    />

                    <FormFieldOption
                      label="Status"
                      htmlFor="status"
                      value={data.status}
                      setValue={(val) => setData('status', val)}
                      message={errors.status}
                      options={statusOptions}
                      badgeRenderer={getStatusBadgeConfig}
                      icon={Activity}
                    />
                  </div>
                </section>
              </CardContent>
            </section>

            <Separator />

            <CardFooter className="flex items-center justify-between p-6">
              <Button type="button" variant="outline" onClick={() => router.visit(route('users.index'))} className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Users
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setData({
                      email: user.data.email || '',
                      username: user.data.username || '',
                      password: '',
                      role: user.data.role || '',
                      status: user.data.status || 'ACTIVE',
                      avatar: user.data.avatar || '',
                    });
                  }}
                  disabled={processing || isSubmitting}
                >
                  Reset Changes
                </Button>

                <Button type="submit" disabled={processing || isSubmitting} className="min-w-[140px]">
                  {processing || isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
