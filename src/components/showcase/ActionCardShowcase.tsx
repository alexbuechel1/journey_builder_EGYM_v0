import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutGrid, List } from 'lucide-react';
import { CurrentCard } from './variations/CurrentCard';
import { ZapierStyleCard } from './variations/ZapierStyleCard';
import { BaserowStyleCard } from './variations/BaserowStyleCard';
import { MinimalCard } from './variations/MinimalCard';
import { DenseCard } from './variations/DenseCard';
import { mockEntryAction, mockFullConfigAction, mockMinimalAction, mockNoDeadlineAction } from './mockActionData';

interface ActionCardShowcaseProps {
  onBack: () => void;
}

type ViewMode = 'grid' | 'list';
type VariationType = 'current' | 'zapier' | 'baserow' | 'minimal' | 'dense';

interface VariationInfo {
  id: VariationType;
  name: string;
  description: string;
  component: React.ComponentType<{ action: any; isEntryAction: boolean }>;
}

const variations: VariationInfo[] = [
  {
    id: 'current',
    name: 'Current Baseline',
    description: 'The existing design with collapsible sections and read-only state',
    component: CurrentCard,
  },
  {
    id: 'zapier',
    name: 'Zapier-Style Compact',
    description: 'Compact, icon-focused design with inline badges and minimal padding',
    component: ZapierStyleCard,
  },
  {
    id: 'baserow',
    name: 'Baserow-Style Visual',
    description: 'Visual card-based sections with icon groups and prominent deadline display',
    component: BaserowStyleCard,
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Maximum whitespace, typography-focused, configuration hidden by default',
    component: MinimalCard,
  },
  {
    id: 'dense',
    name: 'Information-Dense',
    description: 'Shows maximum information without expansion, compact grid layout',
    component: DenseCard,
  },
];

export function ActionCardShowcase({ onBack }: ActionCardShowcaseProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedVariation, setSelectedVariation] = useState<VariationType | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to journey builder">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Action Card Design Variations</h1>
            <p className="text-body-50 text-muted-foreground mt-1">
              Compare different UX/UI approaches for action cards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Variations Display */}
      {viewMode === 'grid' ? (
        <div className="space-y-8">
          {variations.map((variation) => {
            const VariationComponent = variation.component;
            return (
              <div key={variation.id} className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{variation.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{variation.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Entry Action */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Entry Action
                    </div>
                    <VariationComponent action={mockEntryAction} isEntryAction={true} />
                  </div>
                  {/* Full Config Action */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Full Configuration
                    </div>
                    <VariationComponent action={mockFullConfigAction} isEntryAction={false} />
                  </div>
                  {/* Minimal Action */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Minimal Config
                    </div>
                    <VariationComponent action={mockMinimalAction} isEntryAction={false} />
                  </div>
                  {/* No Deadline Action */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      No Deadline
                    </div>
                    <VariationComponent action={mockNoDeadlineAction} isEntryAction={false} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            {variations.map((variation) => (
              <Button
                key={variation.id}
                variant={selectedVariation === variation.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVariation(selectedVariation === variation.id ? null : variation.id)}
              >
                {variation.name}
              </Button>
            ))}
          </div>
          {selectedVariation && (
            <div className="space-y-4">
              {variations
                .filter((v) => v.id === selectedVariation)
                .map((variation) => {
                  const VariationComponent = variation.component;
                  return (
                    <div key={variation.id} className="space-y-4">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">{variation.name}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{variation.description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <VariationComponent action={mockEntryAction} isEntryAction={true} />
                        <VariationComponent action={mockFullConfigAction} isEntryAction={false} />
                        <VariationComponent action={mockMinimalAction} isEntryAction={false} />
                        <VariationComponent action={mockNoDeadlineAction} isEntryAction={false} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

