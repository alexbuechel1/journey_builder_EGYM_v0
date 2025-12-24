import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Journey, Action, Reminder } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { getActionLibraryItem } from '@/lib/actionLibrary';

interface JourneyContextValue {
  currentJourney: Journey | null;
  journeys: Journey[];
  setCurrentJourney: (journeyId: string) => void;
  addAction: (action: Omit<Action, 'id'>) => Promise<void>;
  updateAction: (actionId: string, updates: Partial<Action>) => Promise<void>;
  deleteAction: (actionId: string) => Promise<void>;
  reorderActions: (actionIds: string[]) => Promise<void>;
  loadJourneys: () => Promise<void>;
  saveJourney: () => Promise<void>;
  updateJourneyName: (name: string) => Promise<void>;
  createJourney: (name: string) => Promise<void>;
  isLoading: boolean;
  isLoadingActions: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const JourneyContext = createContext<JourneyContextValue | undefined>(undefined);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [currentJourney, setCurrentJourneyState] = useState<Journey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load journeys from Supabase or use mock data
  const loadJourneys = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        // Load from Supabase
        const { data: journeysData, error: journeysError } = await supabase!
          .from('journeys')
          .select('*')
          .order('created_at', { ascending: false });

        if (journeysError) throw journeysError;

        // Load nodes and actions for each journey
        const journeysWithData = await Promise.all(
          (journeysData || []).map(async (journey) => {
            const { data: nodes } = await supabase!
              .from('journey_nodes')
              .select('*')
              .eq('journey_id', journey.id)
              .order('position');

            const { data: actionsData } = await supabase!
              .from('actions')
              .select('*, reminders(*)')
              .eq('journey_id', journey.id);

            const actions = await Promise.all(
              (actionsData || []).map(async (action) => {
                const { data: reminders } = await supabase!
                  .from('reminders')
                  .select('*')
                  .eq('action_id', action.id)
                  .order('order_index');

                // Get action library item to populate supportedProducts and supportsGuidance
                const libraryItem = getActionLibraryItem(action.action_type_id);

                return {
                  id: action.id,
                  actionTypeId: action.action_type_id,
                  eventType: action.event_type,
                  completionMode: action.completion_mode as Action['completionMode'],
                  requiredCount: action.required_count || undefined,
                  supportedProducts: libraryItem?.supportedProducts || [],
                  product: action.product as Action['product'],
                  visibleInChecklist: action.visible_in_checklist,
                  supportsGuidance: libraryItem?.supportsGuidance || false,
                  guidanceEnabled: action.guidance_enabled,
                  timeRange: {
                    type: action.time_range_type as Action['timeRange']['type'],
                    durationDays: action.time_range_duration_days || undefined,
                    offsetDays: action.time_range_offset_days || undefined,
                  },
                  reminders: (reminders || []).map((r) => ({
                    id: r.id,
                    channel: r.channel as Reminder['channel'],
                    frequencyType: r.frequency_type as Reminder['frequencyType'],
                    frequencyDays: r.frequency_days || undefined,
                    order: r.order_index,
                  })),
                } as Action;
              })
            );

            return {
              id: journey.id,
              name: journey.name,
              isDefault: journey.is_default,
              nodes: (nodes || []).map((n) => ({
                id: n.id,
                nodeType: n.node_type as Journey['nodes'][0]['nodeType'],
                actionId: n.action_id || undefined,
                position: n.position,
              })),
              actions,
              createdAt: new Date(journey.created_at),
              updatedAt: new Date(journey.updated_at),
            } as Journey;
          })
        );

        setJourneys(journeysWithData);
        if (journeysWithData.length > 0 && !currentJourney) {
          const defaultJourney = journeysWithData.find((j) => j.isDefault) || journeysWithData[0];
          setCurrentJourneyState(defaultJourney);
        }
      } else {
        // Mock mode - create a default journey
        const mockJourney: Journey = {
          id: 'mock-journey-1',
          name: 'Gym A — Onboarding Journey (Default)',
          isDefault: true,
          nodes: [
            { id: 'start-1', nodeType: 'START', position: 0 },
          ],
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setJourneys([mockJourney]);
        setCurrentJourneyState(mockJourney);
      }
    } catch (error) {
      console.error('Error loading journeys:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load journeys';
      setError(errorMessage);
      // Fallback to mock data
      const mockJourney: Journey = {
        id: 'mock-journey-1',
        name: 'Gym A — Onboarding Journey (Default)',
        isDefault: true,
        nodes: [{ id: 'start-1', nodeType: 'START', position: 0 }],
        actions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setJourneys([mockJourney]);
      setCurrentJourneyState(mockJourney);
    } finally {
      setIsLoading(false);
    }
  }, [currentJourney]);

  useEffect(() => {
    loadJourneys();
  }, []);

  const setCurrentJourney = useCallback((journeyId: string) => {
    const journey = journeys.find((j) => j.id === journeyId);
    if (journey) {
      setCurrentJourneyState(journey);
    }
  }, [journeys]);

  const addAction = useCallback(async (actionData: Omit<Action, 'id'>) => {
    if (!currentJourney) {
      throw new Error('No journey selected');
    }

    setIsLoadingActions(true);
    setError(null);

    try {
      const newAction: Action = {
        ...actionData,
        id: uuidv4(),
      };

      const updatedActions = [...currentJourney.actions, newAction];
      const updatedNodes = [
        ...currentJourney.nodes,
        {
          id: uuidv4(),
          nodeType: 'ACTION' as const,
          actionId: newAction.id,
          position: currentJourney.nodes.length,
        },
      ];

      const updatedJourney: Journey = {
        ...currentJourney,
        actions: updatedActions,
        nodes: updatedNodes,
        updatedAt: new Date(),
      };

      setCurrentJourneyState(updatedJourney);
      setJourneys((prev) =>
        prev.map((j) => (j.id === currentJourney.id ? updatedJourney : j))
      );

      // Save to Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        try {
        const { error: actionError } = await supabase!.from('actions').insert({
          id: newAction.id,
          journey_id: currentJourney.id,
          action_type_id: newAction.actionTypeId,
          event_type: newAction.eventType,
          completion_mode: newAction.completionMode,
          required_count: newAction.requiredCount || null,
          product: newAction.product,
          visible_in_checklist: newAction.visibleInChecklist,
          guidance_enabled: newAction.guidanceEnabled,
          time_range_type: newAction.timeRange.type,
          time_range_duration_days: newAction.timeRange.durationDays || null,
          time_range_offset_days: newAction.timeRange.offsetDays || null,
        });

        if (actionError) throw actionError;

        // Insert reminders
        if (newAction.reminders.length > 0) {
          const { error: remindersError } = await supabase!.from('reminders').insert(
            newAction.reminders.map((r) => ({
              id: r.id,
              action_id: newAction.id,
              channel: r.channel,
              frequency_type: r.frequencyType,
              frequency_days: r.frequencyDays || null,
              order_index: r.order,
            }))
          );
          if (remindersError) throw remindersError;
        }

        // Insert node
        const newNode = updatedNodes[updatedNodes.length - 1];
        const { error: nodeError } = await supabase!.from('journey_nodes').insert({
          id: newNode.id,
          journey_id: currentJourney.id,
          node_type: newNode.nodeType,
          action_id: newNode.actionId || null,
          position: newNode.position,
        });
        if (nodeError) throw nodeError;

        // Update journey timestamp
        await supabase!
          .from('journeys')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentJourney.id);
        } catch (error) {
          console.error('Error saving action to Supabase:', error);
          throw new Error('Failed to save action to database');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add action';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoadingActions(false);
    }
  }, [currentJourney]);

  const updateAction = useCallback(async (actionId: string, updates: Partial<Action>) => {
    if (!currentJourney) {
      throw new Error('No journey selected');
    }

    setIsLoadingActions(true);
    setError(null);

    try {
      const updatedActions = currentJourney.actions.map((action) =>
        action.id === actionId ? { ...action, ...updates } : action
      );

      const updatedJourney: Journey = {
        ...currentJourney,
        actions: updatedActions,
        updatedAt: new Date(),
      };

      setCurrentJourneyState(updatedJourney);
      setJourneys((prev) =>
        prev.map((j) => (j.id === currentJourney.id ? updatedJourney : j))
      );

      // Save to Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        try {
        const action = updatedActions.find((a) => a.id === actionId);
        if (!action) return;

        const { error } = await supabase!
          .from('actions')
          .update({
            required_count: action.requiredCount || null,
            product: action.product,
            visible_in_checklist: action.visibleInChecklist,
            guidance_enabled: action.guidanceEnabled,
            time_range_type: action.timeRange.type,
            time_range_duration_days: action.timeRange.durationDays || null,
            time_range_offset_days: action.timeRange.offsetDays || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', actionId);

        if (error) throw error;

        await supabase!
          .from('journeys')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentJourney.id);
        } catch (error) {
          console.error('Error updating action in Supabase:', error);
          throw new Error('Failed to update action in database');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update action';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoadingActions(false);
    }
  }, [currentJourney]);

  const deleteAction = useCallback(async (actionId: string) => {
    if (!currentJourney) {
      throw new Error('No journey selected');
    }

    setIsLoadingActions(true);
    setError(null);

    try {
      const updatedActions = currentJourney.actions.filter((a) => a.id !== actionId);
      const updatedNodes = currentJourney.nodes.filter(
        (n) => n.actionId !== actionId
      );

      const updatedJourney: Journey = {
        ...currentJourney,
        actions: updatedActions,
        nodes: updatedNodes,
        updatedAt: new Date(),
      };

      setCurrentJourneyState(updatedJourney);
      setJourneys((prev) =>
        prev.map((j) => (j.id === currentJourney.id ? updatedJourney : j))
      );

      // Delete from Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        try {
        await supabase!.from('actions').delete().eq('id', actionId);
        await supabase!.from('journey_nodes').delete().eq('action_id', actionId);
        await supabase!
          .from('journeys')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentJourney.id);
        } catch (error) {
          console.error('Error deleting action from Supabase:', error);
          throw new Error('Failed to delete action from database');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete action';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoadingActions(false);
    }
  }, [currentJourney]);

  const reorderActions = useCallback(async (actionIds: string[]) => {
    if (!currentJourney) return;

    const reorderedActions = actionIds
      .map((id) => currentJourney.actions.find((a) => a.id === id))
      .filter((a): a is Action => a !== undefined);

    const updatedNodes = currentJourney.nodes.map((node) => {
      if (node.actionId) {
        const actionIndex = actionIds.indexOf(node.actionId);
        return { ...node, position: actionIndex >= 0 ? actionIndex + 1 : node.position };
      }
      return node;
    });

    const updatedJourney: Journey = {
      ...currentJourney,
      actions: reorderedActions,
      nodes: updatedNodes,
      updatedAt: new Date(),
    };

    setCurrentJourneyState(updatedJourney);
    setJourneys((prev) =>
      prev.map((j) => (j.id === currentJourney.id ? updatedJourney : j))
    );

    // Update positions in Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await Promise.all(
          updatedNodes.map((node) =>
            supabase!
              .from('journey_nodes')
              .update({ position: node.position })
              .eq('id', node.id)
          )
        );
        await supabase!
          .from('journeys')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentJourney.id);
      } catch (error) {
        console.error('Error reordering actions in Supabase:', error);
      }
    }
  }, [currentJourney]);

  const saveJourney = useCallback(async () => {
    if (!currentJourney || !isSupabaseConfigured() || !supabase) return;

    try {
      const { error } = await supabase!
        .from('journeys')
        .update({
          name: currentJourney.name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentJourney.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving journey:', error);
    }
  }, [currentJourney]);

  const updateJourneyName = useCallback(
    async (name: string) => {
      if (!currentJourney) {
        throw new Error('No journey selected');
      }

      setIsLoadingActions(true);
      setError(null);

      try {
        const updatedJourney: Journey = {
          ...currentJourney,
          name,
          updatedAt: new Date(),
        };

        setCurrentJourneyState(updatedJourney);
        setJourneys((prev) =>
          prev.map((j) => (j.id === currentJourney.id ? updatedJourney : j))
        );

        // Save to Supabase if configured
        if (isSupabaseConfigured() && supabase) {
          const { error } = await supabase!
            .from('journeys')
            .update({
              name,
              updated_at: new Date().toISOString(),
            })
            .eq('id', currentJourney.id);

          if (error) throw error;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update journey name';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoadingActions(false);
      }
    },
    [currentJourney]
  );

  const createJourney = useCallback(async (name: string) => {
    const newJourney: Journey = {
      id: uuidv4(),
      name,
      isDefault: false,
      nodes: [{ id: uuidv4(), nodeType: 'START', position: 0 }],
      actions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setJourneys((prev) => [...prev, newJourney]);
    setCurrentJourneyState(newJourney);

    // Save to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase!.from('journeys').insert({
          id: newJourney.id,
          name: newJourney.name,
          is_default: newJourney.isDefault,
        });

        if (error) throw error;

        // Insert start node
        const startNode = newJourney.nodes[0];
        const { error: nodeError } = await supabase!.from('journey_nodes').insert({
          id: startNode.id,
          journey_id: newJourney.id,
          node_type: startNode.nodeType,
          position: startNode.position,
        });
        if (nodeError) throw nodeError;
      } catch (error) {
        console.error('Error creating journey in Supabase:', error);
      }
    }
  }, []);

  return (
    <JourneyContext.Provider
      value={{
        currentJourney,
        journeys,
        setCurrentJourney,
        addAction,
        updateAction,
        deleteAction,
        reorderActions,
        loadJourneys,
        saveJourney,
        updateJourneyName,
        createJourney,
        isLoading,
        isLoadingActions,
        error,
        setError,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}

