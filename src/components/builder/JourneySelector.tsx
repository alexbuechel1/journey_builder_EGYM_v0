import { useJourney } from '@/contexts/JourneyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export function JourneySelector() {
  const { journeys, currentJourney, setCurrentJourney, createJourney } = useJourney();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJourneyName, setNewJourneyName] = useState('');

  const handleCreateJourney = async () => {
    if (newJourneyName.trim()) {
      await createJourney(newJourneyName.trim());
      setNewJourneyName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === '__create_new__') {
      setIsCreateDialogOpen(true);
    } else {
      setCurrentJourney(value);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex-1">
        <label htmlFor="journey-select" className="text-marginal-25-medium text-muted-foreground mb-2 block">
          Journey
        </label>
        <Select
          value={currentJourney?.id || ''}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger id="journey-select" className="w-full">
            <SelectValue placeholder="Select a journey" />
          </SelectTrigger>
          <SelectContent>
            {journeys.map((journey) => (
              <SelectItem key={journey.id} value={journey.id}>
                {journey.name}
              </SelectItem>
            ))}
            <SelectItem value="__create_new__">+ Create New Journey</SelectItem>
          </SelectContent>
        </Select>
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
              <label htmlFor="journey-name" className="text-body-50-bold mb-2 block">
                Journey Name
              </label>
              <Input
                id="journey-name"
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
    </div>
  );
}

