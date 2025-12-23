import { useState, useEffect, useMemo } from 'react';
import type { Action, Product, Reminder, TimeRange } from '@/lib/types';
import { getAllActionLibraryItems, getActionLibraryItem, getActionsByCategory, type ActionCategory } from '@/lib/actionLibrary';
import { getProductInfo, PRODUCT_INFO, type ProductInfo } from '@/lib/productMapping';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { TimeRangeSelector } from './TimeRangeSelector';
import { ReminderList } from './ReminderList';
import { Plus, Search, Zap, ArrowLeft } from 'lucide-react';
import { useJourney } from '@/contexts/JourneyContext';

interface ActionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (action: Omit<Action, 'id'>) => void;
  existingAction?: Action;
  isEntryAction: boolean;
  previousActionExists: boolean;
}

export function ActionForm({
  open,
  onClose,
  onSave,
  existingAction,
  previousActionExists,
}: ActionFormProps) {
  const { isLoadingActions } = useJourney();
  const [actionTypeId, setActionTypeId] = useState<string>('');
  const [product, setProduct] = useState<Product>('BMA');
  const [visibleInChecklist, setVisibleInChecklist] = useState(true);
  const [guidanceEnabled, setGuidanceEnabled] = useState(false);
  const [requiredCount, setRequiredCount] = useState<number | undefined>(undefined);
  const [timeRange, setTimeRange] = useState<TimeRange>({ type: 'NONE' });
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'checklist' | 'additional'>('additional');

  const actionLibraryItems = getAllActionLibraryItems();
  const selectedLibraryItem = actionTypeId ? getActionLibraryItem(actionTypeId) : null;

  // Get actions grouped by category
  const actionsByCategory = getActionsByCategory();

  // Filter actions based on search query and group by category
  const filteredActionsByCategory = useMemo(() => {
    const filtered: Record<ActionCategory, ActionLibraryItem[]> = {
      'Onboarding': [],
      'Assessments': [],
      'Training Plan': [],
      'Other': [],
    };

    if (!searchQuery.trim()) {
      return actionsByCategory;
    }

    const query = searchQuery.toLowerCase();
    Object.keys(actionsByCategory).forEach((category) => {
      filtered[category as ActionCategory] = actionsByCategory[category as ActionCategory].filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.eventType.toLowerCase().includes(query)
      );
    });

    return filtered;
  }, [searchQuery, actionsByCategory]);

  useEffect(() => {
    if (existingAction) {
      setActionTypeId(existingAction.actionTypeId);
      setProduct(existingAction.product);
      setVisibleInChecklist(existingAction.visibleInChecklist);
      setGuidanceEnabled(existingAction.guidanceEnabled);
      setRequiredCount(existingAction.requiredCount);
      setTimeRange(existingAction.timeRange);
      setReminders(existingAction.reminders);
    } else {
      // Reset form
      setActionTypeId('');
      setProduct('BMA');
      setVisibleInChecklist(true);
      setGuidanceEnabled(false);
      setRequiredCount(undefined);
      setTimeRange({ type: 'NONE' });
      setReminders([]);
      setSearchQuery('');
    }
    setValidationErrors({});
    setActiveTab('additional'); // Reset to first tab when form opens
  }, [existingAction, open]);

  useEffect(() => {
    if (selectedLibraryItem) {
      setProduct(selectedLibraryItem.supportedProducts[0] || 'BMA');
      setGuidanceEnabled(selectedLibraryItem.defaultGuidanceEnabled);
      if (selectedLibraryItem.completionMode === 'COUNTER') {
        setRequiredCount(1);
      } else {
        setRequiredCount(undefined);
      }
      // Set to Action Configuration tab when action is first selected
      if (!existingAction) {
        setActiveTab('additional');
      }
    }
  }, [selectedLibraryItem, existingAction]);

  const handleAddReminder = () => {
    const newReminder: Reminder = {
      id: uuidv4(),
      channel: 'PUSH',
      frequencyType: 'ONCE',
      order: reminders.length,
    };
    setReminders([...reminders, newReminder]);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!actionTypeId) {
      errors.actionTypeId = 'Please select an action type';
    }

    if (selectedLibraryItem?.completionMode === 'COUNTER') {
      if (!requiredCount || requiredCount < 1) {
        errors.requiredCount = 'Required count must be at least 1';
      }
    }

    if (timeRange.type === 'ABSOLUTE' && (!timeRange.durationDays || timeRange.durationDays < 1)) {
      errors.timeRange = 'Duration must be at least 1 day';
    }

    if (timeRange.type === 'WITH_PREVIOUS' && (!timeRange.offsetDays || timeRange.offsetDays < 1)) {
      errors.timeRange = 'Offset must be at least 1 day';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!selectedLibraryItem || isLoadingActions) return;

    if (!validateForm()) {
      return;
    }

    const action: Omit<Action, 'id'> = {
      actionTypeId,
      eventType: selectedLibraryItem.eventType,
      completionMode: selectedLibraryItem.completionMode,
      requiredCount: selectedLibraryItem.completionMode === 'COUNTER' ? requiredCount : undefined,
      supportedProducts: selectedLibraryItem.supportedProducts,
      product,
      visibleInChecklist,
      supportsGuidance: selectedLibraryItem.supportsGuidance,
      guidanceEnabled: selectedLibraryItem.supportsGuidance ? guidanceEnabled : false,
      timeRange,
      reminders,
    };

    await onSave(action);
  };

  const supportedProducts = selectedLibraryItem?.supportedProducts || [];

  const showActionSelection = !existingAction && !actionTypeId;
  const showConfiguration = existingAction || actionTypeId;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] md:w-[768px] h-[85vh] max-h-[85vh] overflow-hidden flex flex-col">
        {showActionSelection ? (
          /* Step 1: Action Selection - Zapier Style */
          <>
            <DialogHeader className="pb-3 border-b border-border">
              <DialogTitle>Add Action</DialogTitle>
              <DialogDescription>
                Select an action type to add to your journey
              </DialogDescription>
            </DialogHeader>

            {/* Search Bar */}
            <div className="px-6 pt-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                  autoFocus
                />
              </div>
            </div>

            {/* Action Grid - Grouped by Category */}
            <div className="flex-1 overflow-y-auto px-6 py-3">
              {(['Onboarding', 'Assessments', 'Training Plan', 'Other'] as ActionCategory[]).map((category) => {
                const actions = filteredActionsByCategory[category];
                if (actions.length === 0) return null;

                return (
                  <div key={category} className="mb-5 last:mb-0">
                    <h3 className="text-body-50-bold text-foreground mb-2 text-sm">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {actions.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActionTypeId(item.id);
                            setValidationErrors((prev) => ({ ...prev, actionTypeId: '' }));
                          }}
                          className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Zap className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-body-50 font-medium text-foreground leading-tight">
                                {item.title}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {Object.values(filteredActionsByCategory).every(arr => arr.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-body-50 text-muted-foreground">
                    No actions found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-border pt-3 pb-4">
              <Button variant="outline" onClick={onClose} size="sm">
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : (
          /* Step 2: Configuration */
          <>
            <DialogHeader className="pb-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                {!existingAction && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setActionTypeId('');
                      setSearchQuery('');
                    }}
                    className="h-8 w-8"
                    aria-label="Back to action selection"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div>
                  <DialogTitle>
                    {selectedLibraryItem?.title || (existingAction ? 'Edit Action' : 'Configure Action')}
                  </DialogTitle>
                </div>
              </div>
            </DialogHeader>

            {selectedLibraryItem && (
              <>
                  {/* Tab Navigation */}
                  <div className="border-b border-border flex-shrink-0 bg-muted/30">
                    <nav className="flex gap-0 px-6">
                      <button
                        type="button"
                        onClick={() => setActiveTab('additional')}
                        className={`relative px-5 py-3.5 text-body-50 font-medium transition-all border-b-2 ${
                          activeTab === 'additional'
                            ? 'text-foreground border-primary bg-background'
                            : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50'
                        }`}
                      >
                        Action Configuration
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('checklist')}
                        className={`relative px-5 py-3.5 text-body-50 font-medium transition-all border-b-2 ${
                          activeTab === 'checklist'
                            ? 'text-foreground border-primary bg-background'
                            : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50'
                        }`}
                      >
                        Checklist Configuration
                      </button>
                    </nav>
                  </div>
              </>
            )}

            <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
              {selectedLibraryItem && (
                <>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 min-h-[400px]">
                    {/* Checklist Configuration Tab */}
                    {activeTab === 'checklist' && (
                      <section className="space-y-4">
                      
                      {/* Product Selection - Visual Cards */}
                      <div>
                        <Label className="text-body-50-bold mb-1.5 block">Product</Label>
                        <p className="text-body-50 text-muted-foreground mb-3">
                          Choose the product this action should be done with (will guide the member accordingly in the checklist)
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {supportedProducts.map((p) => {
                            const productInfo = getProductInfo(p);
                            const isSelected = product === p;
                            return (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setProduct(p)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                }`}
                                aria-label={`Select ${productInfo.label}`}
                              >
                                <img
                                  src={productInfo.icon}
                                  alt={productInfo.label}
                                  className="w-8 h-8"
                                />
                                <span className="text-body-50 font-medium text-foreground text-center">
                                  {productInfo.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                          <div className="flex-1">
                            <Label htmlFor="visible-in-checklist" className="text-body-50-bold cursor-pointer">
                              Show action for user
                            </Label>
                            <p className="text-body-50 text-muted-foreground mt-0.5">
                              Display this action in the member checklist
                            </p>
                          </div>
                          <Switch
                            id="visible-in-checklist"
                            checked={visibleInChecklist}
                            onChange={(e) => setVisibleInChecklist(e.currentTarget.checked)}
                            aria-label="Visible for user"
                          />
                        </div>

                        {selectedLibraryItem.supportsGuidance && (
                          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                            <div className="flex-1">
                              <Label htmlFor="guidance-enabled" className="text-body-50-bold cursor-pointer">
                                Show guidance for user
                              </Label>
                              <p className="text-body-50 text-muted-foreground mt-0.5">
                                Provide guidance to help members complete this action
                              </p>
                            </div>
                            <Switch
                              id="guidance-enabled"
                              checked={guidanceEnabled}
                              onChange={(e) => setGuidanceEnabled(e.currentTarget.checked)}
                              aria-label="Enable guidance"
                            />
                          </div>
                        )}
                      </div>
                      </section>
                    )}

                    {/* Action Configuration Tab */}
                    {activeTab === 'additional' && (
                      <section className="space-y-6">
                      
                      {/* How many times must this happen? - Always visible */}
                      <div className="pb-6 border-b border-border">
                        <Label htmlFor="required-count" className="text-body-50-bold mb-1.5 block">
                          How many times must this happen?
                          {selectedLibraryItem.completionMode === 'COUNTER' && (
                            <span className="text-destructive"> *</span>
                          )}
                        </Label>
                        <p className="text-body-50 text-muted-foreground text-sm mb-3">
                          {selectedLibraryItem.completionMode === 'COUNTER' 
                            ? 'By default a single event is enough but you can adapt this based on your needs.'
                            : 'This action requires a single event to complete. This cannot be changed for this action type.'}
                        </p>
                        <Input
                          id="required-count"
                          type="number"
                          min="1"
                          value={selectedLibraryItem.completionMode === 'OCCURRENCE' ? 1 : (requiredCount || '')}
                          onChange={(e) => {
                            if (selectedLibraryItem.completionMode === 'COUNTER') {
                              setRequiredCount(parseInt(e.target.value) || undefined);
                              setValidationErrors((prev) => ({ ...prev, requiredCount: '' }));
                            }
                          }}
                          placeholder="e.g., 5"
                          disabled={selectedLibraryItem.completionMode === 'OCCURRENCE'}
                          className={`w-full max-w-32 ${validationErrors.requiredCount ? 'border-destructive' : ''} ${selectedLibraryItem.completionMode === 'OCCURRENCE' ? 'bg-muted cursor-not-allowed' : ''}`}
                          aria-label="How many times must this happen"
                          aria-describedby={validationErrors.requiredCount ? 'required-count-error' : 'required-count-help'}
                          aria-required={selectedLibraryItem.completionMode === 'COUNTER'}
                          aria-invalid={!!validationErrors.requiredCount}
                        />
                        {validationErrors.requiredCount ? (
                          <p id="required-count-error" className="text-body-50 text-destructive mt-1">
                            {validationErrors.requiredCount}
                          </p>
                        ) : (
                          <span id="required-count-help" className="sr-only">
                            Number of times this action must be completed
                          </span>
                        )}
                      </div>

                      {/* Time Range with Reminders */}
                      <div>
                        <TimeRangeSelector
                          value={timeRange}
                          onChange={(newTimeRange) => {
                            setTimeRange(newTimeRange);
                            setValidationErrors((prev) => ({ ...prev, timeRange: '' }));
                            // Clear reminders if time range is removed
                            if (newTimeRange.type === 'NONE') {
                              setReminders([]);
                            }
                          }}
                          previousActionExists={previousActionExists}
                          reminders={reminders}
                          onRemindersChange={setReminders}
                          onAddReminder={handleAddReminder}
                        />
                        {validationErrors.timeRange && (
                          <p className="text-body-50 text-destructive mt-1">
                            {validationErrors.timeRange}
                          </p>
                        )}
                      </div>
                      </section>
                    )}

                  </div>
                </>
              )}
            </div>

            <DialogFooter className="border-t border-border pt-4 flex-shrink-0">
              <Button variant="outline" onClick={onClose} disabled={isLoadingActions}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!selectedLibraryItem || isLoadingActions}>
                {isLoadingActions ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    {existingAction ? 'Update' : 'Add'} Action
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

