import { useState } from 'react';
import { useJourney } from '@/contexts/JourneyContext';
import { JourneySelector } from './JourneySelector';
import { ActionList } from './ActionList';
import { ActionForm } from './ActionForm';
import { TimelineView } from './TimelineView';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { ToastContainer, useToast } from '@/components/ui/toast';
import { X, Zap, Plus, ZoomIn, ZoomOut, Minus, Maximize2, Maximize, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';

export function JourneyBuilder() {
  const { currentJourney, addAction, updateAction, deleteAction } = useJourney();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<{ id: string; title: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  type ExpandState = 'collapsed' | 'expanded' | 'fully-expanded';
  const [expandState, setExpandState] = useState<ExpandState>('expanded');
  const [showTimeline, setShowTimeline] = useState(true);
  const { toasts, showToast, dismissToast } = useToast();

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2)); // Max zoom 2x, increment by 10%
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Min zoom 0.5x, decrement by 10%
  };

  const handleAddAction = () => {
    setEditingAction(undefined);
    setIsFormOpen(true);
  };

  const handleEditAction = (action: Action) => {
    setEditingAction(action);
    setIsFormOpen(true);
  };

  const handleSaveAction = async (actionData: Omit<Action, 'id'>) => {
    try {
      if (editingAction) {
        await updateAction(editingAction.id, actionData);
        showToast('Action updated successfully', 'success');
      } else {
        await addAction(actionData);
        showToast('Action added successfully', 'success');
      }
      setIsFormOpen(false);
      setEditingAction(undefined);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to save action',
        'error'
      );
    }
  };

  const handleDeleteClick = (actionId: string) => {
    const action = currentJourney?.actions.find((a) => a.id === actionId);
    if (action) {
      const libraryItem = getActionLibraryItem(action.actionTypeId);
      const title = libraryItem?.title || action.actionTypeId;
      setActionToDelete({ id: actionId, title });
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (actionToDelete) {
      try {
        await deleteAction(actionToDelete.id);
        showToast('Action deleted successfully', 'success');
        setActionToDelete(null);
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : 'Failed to delete action',
          'error'
        );
      }
    }
  };

  const handleUpdateAction = async (actionId: string, updates: Partial<Action>) => {
    await updateAction(actionId, updates);
  };

  const { error, setError } = useJourney();

  if (!currentJourney) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-body-100 text-muted-foreground">No journey selected</p>
      </div>
    );
  }

  const previousActionExists = currentJourney.actions.length > 0;

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div
          className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg flex items-center justify-between"
          role="alert"
          aria-live="assertive"
        >
          <span className="text-body-100">{error}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* Journey Selector */}
      <JourneySelector />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-body-100-medium font-medium text-foreground">Define the customer experience for your gym</h2>
        </div>
      </div>

      {/* Action List - Always with dotted canvas background */}
      <div className={`relative dotted-canvas bg-muted/30 rounded-lg -mx-6 px-6 pt-6 pb-20 ${currentJourney.actions.length === 0 ? 'min-h-[calc(100vh-300px)]' : 'min-h-[calc(100vh-400px)]'}`}>
        {/* Controls - Fixed position, not affected by zoom */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white border border-border rounded-md shadow-sm p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="h-8 w-8"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="text-xs text-muted-foreground px-2 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2}
              className="h-8 w-8"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          
          {/* Expand State Selector */}
          <div className="bg-white border border-border rounded-md shadow-sm p-1">
            <Select value={expandState} onValueChange={(value) => setExpandState(value as ExpandState)}>
              <SelectTrigger className="h-8 w-full border-0 shadow-none focus:ring-0 px-2 py-0 text-xs">
                <div className="flex items-center gap-1.5 flex-1">
                  {expandState === 'collapsed' && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
                  {expandState === 'expanded' && <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />}
                  {expandState === 'fully-expanded' && <Maximize className="h-3.5 w-3.5 text-muted-foreground" />}
                  <SelectValue>
                    <span className="text-xs text-muted-foreground">
                      {expandState === 'collapsed' ? 'Collapsed' : expandState === 'expanded' ? 'Expanded' : 'Full'}
                    </span>
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collapsed">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4" />
                    <span>Collapsed</span>
                  </div>
                </SelectItem>
                <SelectItem value="expanded">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-4 w-4" />
                    <span>Expanded</span>
                  </div>
                </SelectItem>
                <SelectItem value="fully-expanded">
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4" />
                    <span>Fully Expanded</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeline Toggle */}
          <div className="bg-white border border-border rounded-md shadow-sm p-1.5">
            <div className="flex items-center justify-between gap-2 px-1 min-w-[120px]">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Timeline</span>
              </div>
              <Switch
                checked={showTimeline}
                onChange={(e) => setShowTimeline(e.target.checked)}
                aria-label="Toggle timeline visibility"
              />
            </div>
          </div>
        </div>

        {/* Empty state - positioned relative to parent, not affected by zoom */}
        {currentJourney.actions.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="bg-[#f5f5f0] border-2 border-dashed border-primary rounded-lg p-6 shadow-lg min-w-[320px] transition-transform duration-200"
              style={{ 
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center',
              }}
            >
              {/* Action button inside card - top left */}
              <button
                onClick={handleAddAction}
                className="flex items-center gap-2 bg-[#2d2d2d] text-white border border-white/20 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-[#3d3d3d] transition-colors mb-4"
                aria-label="Add new action"
              >
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Action</span>
              </button>
              
              {/* Step number text */}
              <p className="text-body-100 font-medium text-foreground">
                <span className="font-semibold">1.</span> Add your first action to get started
              </p>
            </div>
          </div>
        ) : (
          /* Content container with zoom - only actions scale, canvas stays full screen */
          <div 
            className="relative transition-transform duration-200 w-full"
            style={{ 
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
            }}
          >
            <>
              {/* Main content area with timeline and action list - shared scroll */}
              <div className="flex gap-6 overflow-y-auto max-h-[calc(100vh-300px)]">
                {/* Vertical Timeline - Left side */}
                {showTimeline && (
                  <div className="w-56 flex-shrink-0">
                    <TimelineView
                      actions={currentJourney.actions}
                      onActionClick={(actionId) => {
                        // Scroll to action card
                        const element = document.getElementById(`action-${actionId}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          // Add a highlight effect
                          element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                          setTimeout(() => {
                            element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                          }, 2000);
                        }
                      }}
                    />
                  </div>
                )}
                
                {/* Action list on dotted canvas */}
                <div className="flex-1 relative">
                  <ActionList
                    actions={currentJourney.actions}
                    onEdit={handleEditAction}
                    onDelete={handleDeleteClick}
                    onUpdate={handleUpdateAction}
                    expandState={expandState}
                  />
                  
                  {/* Floating Add Action Button - Zapier style */}
                  <div className="relative flex flex-col items-center mt-4">
                    {/* Connection line from last action */}
                    <div className={`w-0.5 bg-primary ${expandState === 'collapsed' ? 'h-1' : 'h-4'}`}></div>
                    
                    {/* Floating plus button */}
                    <button
                      onClick={handleAddAction}
                      className="relative z-10 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Add new action"
                    >
                      <Plus className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          </div>
        )}
      </div>

      {/* Action Form Dialog */}
      <ActionForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAction(undefined);
        }}
        onSave={handleSaveAction}
        existingAction={editingAction}
        isEntryAction={currentJourney.actions.length === 0}
        previousActionExists={previousActionExists}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        actionTitle={actionToDelete?.title}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

