import { useJourney } from '@/contexts/JourneyContext';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast, ToastContainer } from '@/components/ui/toast';
import { ChevronDown, Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function JourneySelector() {
  const {
    journeys,
    currentJourney,
    setCurrentJourney,
    createJourney,
    updateJourneyName,
  } = useJourney();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJourneyName, setNewJourneyName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toasts, showToast, dismissToast } = useToast();

  const handleCreateJourney = async () => {
    if (newJourneyName.trim()) {
      await createJourney(newJourneyName.trim());
      setNewJourneyName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleSelectChange = (journeyId: string) => {
    if (journeyId === '__create_new__') {
      setIsCreateDialogOpen(true);
      setIsDropdownOpen(false);
    } else {
      setCurrentJourney(journeyId);
      setIsDropdownOpen(false);
    }
  };

  // Sync edited name with current journey
  useEffect(() => {
    if (currentJourney) {
      setEditedName(currentJourney.name);
    }
  }, [currentJourney]);

  const handleStartEditName = () => {
    if (currentJourney) {
      setEditedName(currentJourney.name);
      setIsEditingName(true);
      // Focus the input after a brief delay to ensure it's rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleCancelEditName = () => {
    if (currentJourney) {
      setEditedName(currentJourney.name);
    }
    setIsEditingName(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameBlur = async () => {
    if (!currentJourney || !editedName.trim()) {
      handleCancelEditName();
      return;
    }

    // Only save if the name actually changed
    if (editedName.trim() !== currentJourney.name) {
      try {
        await updateJourneyName(editedName.trim());
        setIsEditingName(false);
        showToast('Journey name updated', 'success');
      } catch (error) {
        setEditedName(currentJourney.name); // Revert on error
        showToast(
          error instanceof Error ? error.message : 'Failed to update journey name',
          'error'
        );
      }
    } else {
      setIsEditingName(false);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      handleCancelEditName();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex-1">
        <label htmlFor="journey-name" className="text-marginal-25-medium text-muted-foreground mb-2 block">
          Journey
        </label>
        <div className="relative">
          <div className="relative flex items-center">
            <Input
              ref={inputRef}
              id="journey-name"
              value={editedName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              placeholder="Select or create a journey"
              className={cn(
                "pr-20",
                !isEditingName && "bg-muted/50 cursor-default"
              )}
              readOnly={!isEditingName || !currentJourney}
            />
            <div className="absolute right-0 flex items-center gap-1">
              {currentJourney && (
                <>
                  {isEditingName ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCancelEditName}
                      aria-label="Cancel editing"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleStartEditName}
                      aria-label="Edit journey name"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Select journey"
              >
                <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isDropdownOpen && "rotate-180")} />
              </Button>
            </div>
          </div>
          
          {/* Custom Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-sm border border-input bg-background text-body-100 text-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                <div className="p-1">
                  {journeys.map((journey) => (
                    <button
                      key={journey.id}
                      type="button"
                      className={cn(
                        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-body-100 outline-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground",
                        currentJourney?.id === journey.id && "bg-accent text-accent-foreground font-medium"
                      )}
                      onClick={() => handleSelectChange(journey.id)}
                    >
                      {journey.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-body-100 outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={() => handleSelectChange('__create_new__')}
                  >
                    + Create New Journey
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Journey</DialogTitle>
            <DialogDescription>
              Create a new customer journey to configure actions and reminders.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="new-journey-name" className="text-body-50-bold mb-2 block">
                Journey Name
              </label>
              <Input
                id="new-journey-name"
                value={newJourneyName}
                onChange={(e) => setNewJourneyName(e.target.value)}
                placeholder="e.g., Default Onboarding Journey"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateJourney();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateJourney}
              disabled={!newJourneyName.trim()}
            >
              Create Journey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
