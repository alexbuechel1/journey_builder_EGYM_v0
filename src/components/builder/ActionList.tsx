import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as React from 'react';
import type { Action } from '@/lib/types';
import { ActionCard } from './ActionCard';
import { useJourney } from '@/contexts/JourneyContext';
import { isInGroup } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ActionListProps {
  actions: Action[];
  onEdit: (action: Action) => void;
  onDelete: (actionId: string) => void;
  onUpdate: (actionId: string, updates: Partial<Action>) => void;
  expandState?: 'collapsed' | 'expanded' | 'fully-expanded';
}

function SortableActionCard({
  action,
  isEntryAction,
  onEdit,
  onDelete,
  isOver,
  expandState,
}: {
  action: Action;
  isEntryAction: boolean;
  onEdit: (action: Action) => void;
  onDelete: (actionId: string) => void;
  isOver?: boolean;
  expandState?: 'collapsed' | 'expanded' | 'fully-expanded';
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: action.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={isOver && !isDragging ? 'ring-2 ring-primary ring-offset-2 rounded-lg' : ''}
    >
      <ActionCard
        action={action}
        isEntryAction={isEntryAction}
        onEdit={() => onEdit(action)}
        onDelete={() => onDelete(action.id)}
        dragHandleProps={{ ...attributes, ...listeners }}
        expandState={expandState}
      />
    </div>
  );
}

export function ActionList({
  actions,
  onEdit,
  onDelete,
  onUpdate: _onUpdate,
  expandState = 'expanded',
}: ActionListProps) {
  const { reorderActions } = useJourney();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragOverEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setOverId(null);

    if (over && active.id !== over.id) {
      const oldIndex = actions.findIndex((a) => a.id === active.id);
      const newIndex = actions.findIndex((a) => a.id === over.id);

      const reordered = arrayMove(actions, oldIndex, newIndex);
      const actionIds = reordered.map((a) => a.id);
      reorderActions(actionIds);
    }
  };

  // Build groups of consecutive items - recalculated whenever actions change
  // This ensures grouping updates correctly when:
  // - Actions are reordered (drag and drop)
  // - Action timeframes are changed
  // - Actions are added/removed
  const buildGroups = React.useMemo(() => {
    const groups: Array<{ items: Array<{ action: Action; index: number }>; isGroup: boolean }> = [];
    let currentGroup: Array<{ action: Action; index: number }> | null = null;
    let currentIsGroup = false;

    actions.forEach((action, index) => {
      const inGroup = isInGroup(actions, index);
      
      if (inGroup && !currentIsGroup) {
        // Start new group
        if (currentGroup) {
          groups.push({ items: currentGroup, isGroup: false });
        }
        currentGroup = [{ action, index }];
        currentIsGroup = true;
      } else if (inGroup && currentIsGroup) {
        // Continue group
        currentGroup!.push({ action, index });
      } else if (!inGroup && currentIsGroup) {
        // End group
        groups.push({ items: currentGroup!, isGroup: true });
        currentGroup = [{ action, index }];
        currentIsGroup = false;
      } else {
        // Continue non-group
        if (!currentGroup) {
          currentGroup = [];
        }
        currentGroup.push({ action, index });
      }
    });

    // Add final group
    if (currentGroup) {
      groups.push({ items: currentGroup, isGroup: currentIsGroup });
    }

    return groups;
  }, [actions]);

  const groups = buildGroups;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={actions.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-0 pt-4">
          {groups.map((group, groupIdx) => {
            if (group.isGroup) {
              // Render grouped items with wrapper
              const firstItemIndex = group.items[0].index;
              const lastItemIndex = group.items[group.items.length - 1].index;
              
              return (
                <div key={`group-${groupIdx}`} className="w-full max-w-sm mx-auto">
                  {/* Connection line before group */}
                  {firstItemIndex > 0 && (
                    <div className={cn(
                      "w-0.5 bg-primary mx-auto",
                      expandState === 'collapsed' ? 'h-1' : 'h-4'
                    )}></div>
                  )}
                  
                  {/* Group container with dotted border */}
                  <div className="border-2 border-dashed border-primary/40 rounded-lg bg-primary/5">
                    <div className="space-y-0">
                      {group.items.map(({ action, index }, itemIdx) => {
                        const nextInGroup = itemIdx < group.items.length - 1;
                        
                        return (
                          <div key={action.id} className="flex flex-col items-center w-full">
                            {/* Connection line above action - within group */}
                            {itemIdx > 0 && (
                              <div className={cn(
                                "w-0.5 bg-primary/40 mx-auto",
                                expandState === 'collapsed' ? 'h-1' : 'h-4'
                              )}></div>
                            )}
                            
                            {/* Action card */}
                            <div className="w-full">
                              <SortableActionCard
                                action={action}
                                isEntryAction={index === 0}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                isOver={overId === action.id && activeId !== action.id}
                                expandState={expandState}
                              />
                            </div>
                            
                            {/* Connection line below action - within group */}
                            {nextInGroup && (
                              <div className={cn(
                                "w-0.5 bg-primary/40 mx-auto",
                                expandState === 'collapsed' ? 'h-1' : 'h-4'
                              )}></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Connection line after group */}
                  {lastItemIndex < actions.length - 1 && (
                    <div className={cn(
                      "w-0.5 bg-primary mx-auto",
                      expandState === 'collapsed' ? 'h-1' : 'h-4'
                    )}></div>
                  )}
                </div>
              );
            } else {
              // Render non-grouped items
              return (
                <React.Fragment key={`ungrouped-${groupIdx}`}>
                  {group.items.map(({ action, index }, itemIdx) => {
                    const isLastInUngrouped = groupIdx === groups.length - 1 && itemIdx === group.items.length - 1;
                    
                    return (
                      <div key={action.id} className="flex flex-col items-center w-full">
                        {/* Connection line above action */}
                        {index > 0 && (
                          <div className={cn(
                            "w-0.5 bg-primary mx-auto",
                            expandState === 'collapsed' ? 'h-1' : 'h-4'
                          )}></div>
                        )}
                        
                        {/* Action card */}
                        <div className="w-full max-w-sm mx-auto">
                          <SortableActionCard
                            action={action}
                            isEntryAction={index === 0}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isOver={overId === action.id && activeId !== action.id}
                            expandState={expandState}
                          />
                        </div>
                        
                        {/* Connection line below action */}
                        {!isLastInUngrouped && (
                          <div className={cn(
                            "w-0.5 bg-primary mx-auto",
                            expandState === 'collapsed' ? 'h-1' : 'h-4'
                          )}></div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            }
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
