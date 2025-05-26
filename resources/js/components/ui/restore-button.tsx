import { useForm } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/elements/button';

export function RestoreButton({
  resourceName,
  id,
}: {
  resourceName: string;
  id: number;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { post } = useForm();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    post(route(`${resourceName}s.restore`, id), {
      onFinish: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="cursor-pointer" variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Restore <span className="capitalize">{resourceName}</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to restore this {resourceName}?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogFooter>
            <Button type="submit">Restore</Button>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}