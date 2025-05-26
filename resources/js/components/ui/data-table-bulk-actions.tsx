import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Trash2, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/elements/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Row } from '@tanstack/react-table';

interface DataWithId {
  id: number;
  deleted_at?: string | null;
}

interface DataTableBulkActionsProps<TData extends DataWithId> {
  selectedRows: Row<TData>[];
  resourceName: string;
  onClearSelection: () => void;
}

export function DataTableBulkActions<TData extends DataWithId>({
  selectedRows,
  resourceName,
  onClearSelection,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  const hasDeletedItems = selectedRows.some(row => row.original.deleted_at);
  const hasActiveItems = selectedRows.some(row => !row.original.deleted_at);

  const handleBulkDelete = () => {
    const activeIds = selectedRows
      .filter(row => !row.original.deleted_at)
      .map(row => row.original.id);
      
    if (activeIds.length === 0) return;

    setProcessing(true);
    router.post(route(`${resourceName}s.bulk-delete`), 
      { ids: activeIds },
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
          onClearSelection();
          setProcessing(false);
        },
        onError: () => {
          setProcessing(false);
        },
      }
    );
  };

  const handleBulkRestore = () => {
    const deletedIds = selectedRows
      .filter(row => row.original.deleted_at)
      .map(row => row.original.id);
      
    if (deletedIds.length === 0) return;

    setProcessing(true);
    router.post(route(`${resourceName}s.bulk-restore`), 
      { ids: deletedIds },
      {
        onSuccess: () => {
          setShowRestoreDialog(false);
          onClearSelection();
          setProcessing(false);
        },
        onError: () => {
          setProcessing(false);
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2">
          <Badge variant="default">
            {selectedRows.length} selected
          </Badge>
          <span className="text-sm text-muted-foreground">
            Bulk actions available
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveItems && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={processing}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
          
          {hasDeletedItems && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRestoreDialog(true)}
              disabled={processing}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore Selected
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Items</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.filter(row => !row.original.deleted_at).length} selected {resourceName}(s)? 
              This action can be undone by restoring the items later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={processing}
            >
              {processing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Selected Items</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore {selectedRows.filter(row => row.original.deleted_at).length} selected {resourceName}(s)?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRestoreDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkRestore}
              disabled={processing}
            >
              {processing ? 'Restoring...' : 'Restore'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}