import { cn } from '@/lib/utils';
import { EditIcon, Eye, EyeOff, LucideIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/elements/button';
import Input from '@/components/elements/input';
import InputError from '@/components/elements/input-error';
import Label from '@/components/elements/label';

import Card from '@/components/fragments/card/card';
import CardDescription from '@/components/fragments/card/card-description';
import CardHeader from '@/components/fragments/card/card-header';
import CardTitle from '@/components/fragments/card/card-title';

type FormFieldPropsInput = {
  label: string;
  htmlFor: string;
  type: string;
  value: string;
  message: string;
  setValue: (value: string) => void;
  icon?: LucideIcon | null;
  required?: boolean | false;
  className?: string;
  onFilled?: () => void;
} & React.ComponentProps<'input'>;

export default function FormFieldInput({
  label,
  htmlFor,
  message,
  type,
  value,
  className,
  icon,
  required,
  setValue,
  onFilled,
  ...props
}: FormFieldPropsInput) {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const [wasEmpty, setWasEmpty] = useState(value.trim() === '');

  useEffect(() => {
    if (editMode) {
      setInputValue(value);
      setWasEmpty(value.trim() === '');
    }
  }, [editMode, value]);

  const handleSave = () => {
    setEditMode(false);
    setValue(inputValue);
    if (wasEmpty && inputValue.trim() !== '') {
      onFilled?.();
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setInputValue(value);
  };

  return (
    <Card className={cn('grid gap-2', message && 'border-red-500', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Label htmlFor={htmlFor} className="text-xl">
            {icon ? React.createElement(icon, { className: 'text-muted-foreground mr-2 h-4 w-4' }) : null}
            {label}
            {required ? <span className="text-destructive ml-1">*</span> : null}
          </Label>
          {editMode ? (
            <Button type="button" onClick={handleCancel} className="cursor-pointer" size="sm" variant="link">
              Cancel
            </Button>
          ) : (
            <Button type="button" onClick={() => setEditMode(true)} className="cursor-pointer" size="sm" variant="link">
              <EditIcon className="h-4 w-4" />
              Edit {label}
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          {editMode ? (
            <div className="relative flex flex-col gap-2">
              <Input
                type={type === 'password' && showPassword ? 'text' : type}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-12"
                {...props}
              />
              {type === 'password' && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-[50%] right-2 -translate-y-[105%]"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
              <InputError message={message} />
              <Button onClick={handleSave} type="button" className="w-16 cursor-pointer" size="sm">
                Save
              </Button>
            </div>
          ) : (
            <p>{value !== undefined && value.trim() !== '' ? (type === 'password' ? '*'.repeat(value.length) : value) : `No ${label}`}</p>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
