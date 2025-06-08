import { getRoleBadgeConfig, getStatusBadgeConfig } from '@/helper/badge-helper';
import { useRequiredFieldNumber } from '@/hooks/use-required-field-number';
import type { BreadcrumbItem, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Activity, ChevronLeft, LoaderCircle, Lock, Mail, Shield, User, UserPlus } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import FormFieldOption from '@/components/fragments/form/form-field-option';
import AvatarUploadField from '@/components/fragments/form/form-field-avatar';

import AppLayout from '@/components/layouts/app-layout';


export default function UsersCreate() {
  const { success, error } = usePage<SharedData>().props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    role: '',
    status: 'ACTIVE',
    avatar: null as File | null,
  });

  const roleOptions = useMemo(() => [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'COURIER', label: 'Courier' },
    { value: 'CLIENT', label: 'Client' },
  ], []);


  const statusOptions = useMemo(() => [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ], []);

  const [requiredFieldsNumber, setRequiredFieldsNumber] = useRequiredFieldNumber(data);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Users',
      href: route('users.index'),
    },
    {
      title: 'Create',
      href: route('users.create'),
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    post(route('users.store'), {
      onSuccess: () => {
        toast.success('User created successfully');
        reset('password', 'password_confirmation', 'role', 'email', 'username', 'avatar');
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Failed to create user');
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleImageChange = useCallback((e: File | null) => {
    // const file = e.;
    if (e) {
      setData('avatar', e);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(e);
    }
  }, [setData]);

  const removeImage = () => {
    setData('avatar', null);
    setImagePreview(null);
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
              <div className="bg-primary/10 rounded-full p-2">
                <UserPlus className="text-primary h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create New User</CardTitle>
                <CardDescription className="mt-1">Complete all required field ({requiredFieldsNumber}/6)</CardDescription>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <form onSubmit={handleSubmit}>
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
                  />

                  <FormFieldInput
                    label="Password"
                    htmlFor="password"
                    type="password"
                    value={data.password}
                    message={errors.password || ''}
                    setValue={(value) => setData('password', value)}
                    icon={Lock}
                    required
                    onFilled={() => {
                      setRequiredFieldsNumber(requiredFieldsNumber + 1);
                    }}
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />

                  <FormFieldInput
                    label="Confirm Password"
                    htmlFor="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    message={errors.password_confirmation || ''}
                    setValue={(value) => setData('password_confirmation', value)}
                    icon={Lock}
                    required
                    onFilled={() => {
                      setRequiredFieldsNumber(requiredFieldsNumber + 1);
                    }}
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="Enter password_confirmation"
                    aria-invalid={errors.password_confirmation ? 'true' : 'false'}
                    aria-describedby={errors.password_confirmation ? 'password_confirmation-error' : undefined}
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

                <AvatarUploadField
                  imagePreview={imagePreview}
                  onImageChange={handleImageChange}
                  onRemoveImage={removeImage}
                  username={data.username}
                  error={errors.avatar}
                />
              </section>
            </CardContent>

            <Separator />

            <CardFooter className="flex items-center justify-between p-6">
              <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Users
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => reset('password', 'password_confirmation', 'role', 'email', 'username', 'avatar')}
                  disabled={processing || isSubmitting}
                >
                  Reset Form
                </Button>

                <Button type="submit" disabled={processing || isSubmitting} className="min-w-[140px]">
                  {processing || isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create User
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
