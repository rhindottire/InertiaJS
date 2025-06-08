import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/elements/button';
import InputError from '@/components/elements/input-error';
import Label from '@/components/elements/label';
import Card from '@/components/fragments/card/card';
import CardDescription from '@/components/fragments/card/card-description';
import CardHeader from '@/components/fragments/card/card-header';
import CardTitle from '@/components/fragments/card/card-title';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditIcon } from 'lucide-react';

type FormFieldSelectProps = {
  label: string;
  htmlFor: string;
  value: string;
  setValue: (value: string) => void;
  message?: string;
  required?: boolean;
  className?: string;
  options: { value: string; label: string }[];
  badgeRenderer?: (value: string) => React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

export default function FormFieldOption({
  label,
  htmlFor,
  value,
  setValue,
  message = '',
  required = false,
  className,
  options,
  badgeRenderer,
  icon: Icon,
  disabled = false,
}: FormFieldSelectProps) {
  const [editMode, setEditMode] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    if (!editMode) {
      setSelectedValue(value);
    }
  }, [editMode, value]);

  const handleSave = () => {
    setEditMode(false);
    setValue(selectedValue);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedValue(value);
  };

  return (
    <Card className={cn('grid gap-2', message && 'border-red-500', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Label htmlFor={htmlFor} className="flex items-center text-xl">
            {Icon && <Icon className="text-muted-foreground mr-2 h-4 w-4" />}
            {label}
            {required ? <span className="text-destructive ml-1">*</span> : null}
          </Label>
          {editMode ? (
            <Button type='button' size="sm" variant="link" onClick={handleCancel}>
              Cancel
            </Button>
          ) : (
            <Button type='button' size="sm" variant="link" onClick={() => !disabled && setEditMode(true)}>
              <EditIcon className="h-4 w-4" />
              Edit {label}
            </Button>
          )}
        </CardTitle>

        <CardDescription>
          {editMode ? (
            <div>
              <Select value={selectedValue} onValueChange={setSelectedValue} disabled={disabled} aria-labelledby={htmlFor} aria-invalid={!!message} required={required}>
                <SelectTrigger id={htmlFor} className="w-full">
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                  {selectedValue && badgeRenderer && badgeRenderer(selectedValue)}
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {options.map(({ value: val, label: lbl }) => (
                      <SelectItem key={val} value={val}>
                        {lbl}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {message && <InputError message={message} />}
              <Button onClick={handleSave} type="button" className="mt-2 w-16" size="sm">
                Save
              </Button>
            </div>
          ) : (
            <p>
              {value
                ? badgeRenderer
                  ? badgeRenderer(value)
                  : value
                : `No ${label}`}
            </p>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
