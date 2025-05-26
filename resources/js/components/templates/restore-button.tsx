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

interface RestoreButtonProps {
  resourceName: string;
  id: number;
}

export function RestoreButton({ resourceName, id }: RestoreButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { post, processing } = useForm();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
            <Button type="submit" disabled={processing}>
              {processing ? 'Restoring...' : 'Restore'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}