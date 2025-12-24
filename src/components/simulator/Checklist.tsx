import { useSimulator } from '@/contexts/SimulatorContext';
import { ChecklistItem } from './ChecklistItem';
import { CheckSquare2 } from 'lucide-react';

export function Checklist() {
  const { actionInstances } = useSimulator();

  // Filter to only show actions that are visible in checklist
  const visibleActions = actionInstances.filter(
    (action) => action.visibleInChecklist
  );

  // Sort by position (based on journey order)
  const sortedActions = [...visibleActions].sort(() => {
    // This is a simplified sort - in a real implementation, we'd use journey node positions
    return 0;
  });

  const completedCount = sortedActions.filter(a => a.status === 'DONE').length;
  const progressPercentage = sortedActions.length > 0 
    ? Math.round((completedCount / sortedActions.length) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckSquare2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-body-100 font-medium text-foreground">My Checklist</h2>
              <p className="text-body-50 text-muted-foreground">
                {completedCount} of {sortedActions.length} completed
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        {sortedActions.length > 0 && (
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Actions List */}
      {sortedActions.length === 0 ? (
        <div className="rounded-lg border border-input bg-background p-12 text-center">
          <div className="p-4 bg-secondary/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckSquare2 className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <p className="text-body-100 font-medium text-foreground mb-1">No actions yet</p>
          <p className="text-body-50 text-muted-foreground">
            Actions marked as visible will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedActions.map((actionInstance) => (
            <ChecklistItem key={actionInstance.id} actionInstance={actionInstance} />
          ))}
        </div>
      )}
    </div>
  );
}

