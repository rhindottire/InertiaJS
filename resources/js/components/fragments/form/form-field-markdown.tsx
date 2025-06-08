import type React from 'react';

import { cn } from '@/lib/utils';
import { EditIcon } from 'lucide-react';
import { useState } from 'react';

import Label from '@/components/elements/label';
import { Button } from '@/components/elements/button';
import InputError from '@/components/elements/input-error';

import Card from '@/components/fragments/card/card';
import CardDescription from '@/components/fragments/card/card-description';
import CardHeader from '@/components/fragments/card/card-header';
import CardTitle from '@/components/fragments/card/card-title';

import MarkdownEditor from '@/components/templates/markdown-editor';
import MarkdownViewer from '@/components/templates/markdown-viewer';

type FormFieldMarkdownProps = {
  htmlFor: string;
  label: string;
  message: string;
  value: string;
  setValue: (value: string) => void;
  onFilled?: () => void;
  onChange: (
    value?: string,
    event?: React.ChangeEvent<HTMLTextAreaElement>,
    state?: unknown,
  ) => void;
  className?: string;
};

export default function FormFieldMarkdown({
  htmlFor,
  label,
  message,
  value,
  setValue,
  onFilled,
  onChange,
  className,
  ...props
}: FormFieldMarkdownProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(value);
  const [wasEmpty, setWasEmpty] = useState(value.trim() === '');

  // Store the original value when entering edit mode
  const [originalValue, setOriginalValue] = useState(value);

  // When entering edit mode, store the original value and set input value
  const handleEditMode = () => {
    setOriginalValue(value);
    setInputValue(value);
    setWasEmpty(value.trim() === '');
    setEditMode(true);
  };

  // When saving, update the actual value and exit edit mode
  const handleSave = () => {
    setEditMode(false);
    setValue(inputValue);
    if (wasEmpty && inputValue.trim() !== '') {
      onFilled?.();
    }
  };

  // When canceling, revert to the original value and exit edit mode
  const handleCancel = () => {
    setEditMode(false);
    setInputValue(originalValue); // Revert to original value
    // Don't call setValue here to avoid saving changes
  };

  // Handle markdown editor changes
  const handleEditorChange = (
    newValue?: string,
    event?: React.ChangeEvent<HTMLTextAreaElement>,
    state?: unknown,
  ) => {
    setInputValue(newValue || '');
    // Don't call onChange here to avoid updating parent state during editing
  };

  return (
    <Card className={cn('grid gap-2', message && 'border-red-500', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Label htmlFor={htmlFor} className="text-xl">
            {label}
          </Label>
          {editMode ? (
            <Button
              type="button"
              onClick={handleCancel}
              className="cursor-pointer"
              size="sm"
              variant="link"
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleEditMode}
              className="cursor-pointer"
              size="sm"
              variant="link"
            >
              <EditIcon className="h-4 w-4" />
              Edit {label}
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          {editMode ? (
            <div className="flex flex-col gap-2">
              <MarkdownEditor
                value={inputValue}
                onChange={handleEditorChange}
                {...props}
              />
              <InputError message={message} />
              <Button
                type="button"
                onClick={handleSave}
                className="w-16 cursor-pointer"
                size="sm"
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="prose">
              <MarkdownViewer content={value ? value : `No ${label}`} />
            </div>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}