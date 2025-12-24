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
        <div className="space-y-0">
          {actions.map((action, index) => (
            <div key={action.id} className="flex flex-col items-center w-full">
              {/* Connection line above action (except for first action) */}
              {index > 0 && (
                <div className={`w-0.5 bg-primary ${expandState === 'collapsed' ? 'h-1' : 'h-4'}`}></div>
              )}
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
              {/* Connection line below action (only if not the last action) */}
              {index < actions.length - 1 && (
                <div className={`w-0.5 bg-primary ${expandState === 'collapsed' ? 'h-1' : 'h-4'}`}></div>
              )}
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

