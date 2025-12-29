import type { ActionInstance } from '@/lib/types';
import { CheckCircle2, Clock, AlertCircle, Circle } from 'lucide-react';

interface ChecklistItemProps {
  actionInstance: ActionInstance;
}

export function ChecklistItem({ actionInstance }: ChecklistItemProps) {
  const getStatusIcon = () => {
    switch (actionInstance.status) {
      case 'DONE':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'OVERDUE':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
      {getStatusIcon()}
      <div className="flex-1">
        <p className="text-body-100 text-foreground">
          Action {actionInstance.actionTypeId}
        </p>
        <p className="text-body-50 text-muted-foreground">
          Status: {actionInstance.status}
        </p>
      </div>
    </div>
  );
}
