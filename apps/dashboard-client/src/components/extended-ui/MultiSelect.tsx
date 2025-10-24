import { cn } from '@/lib/utils';
import { Button } from '@ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@ui/command';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@ui/popover';
import { TooltipProviderCustomised } from '@ui/tooltip';
import { unionBy } from 'lodash';
import { Frown, Loader2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from '../ui/sonner';

interface MultiSelectProps<TOption> {
  options: TOption[];
  selectedOptions: TOption[] | undefined;
  onApplyFilter: (value: TOption[]) => void;
  onClearFilter: () => void;
  searchInputPlaceholder?: string;
  shouldHideSearchInput?: boolean;
  renderOption: (option: TOption, isSelected: boolean) => React.ReactNode;
  getOptionValue: (option: TOption) => string;
  renderTrigger: (option: TOption[] | undefined, isPopoverOpen: boolean) => React.ReactNode;
  onCreateOption?: (query: string) => Promise<TOption>;
  classNames?: {
    wrapper?: string;
    selectTrigger?: string;
    popoverContent?: string;
    commandInput?: string;
    commandItem?: string;
    commandGroup?: string;
  };
}
export function MultiSelect<TOption>({
  options,
  selectedOptions,
  onApplyFilter,
  onClearFilter,
  renderOption,
  getOptionValue,
  searchInputPlaceholder = 'Search',
  renderTrigger,
  shouldHideSearchInput = false,
  onCreateOption,
  classNames,
}: MultiSelectProps<TOption>) {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [localSelectedOptionList, setLocalSelectedOptionList] = useState(
    selectedOptions || ([] as TOption[])
  );
  const [isCreatingOption, setIsCreatingOption] = useState(false);

  const commandListRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  const [shouldDisableApplyFilter, setShouldDisableApplyFilter] = useState(true);

  const handleLocalPlatformSelect = (platform: TOption) => {
    if (commandListRef.current) {
      setScrollPosition(commandListRef?.current?.scrollTop);
    }
    if (shouldDisableApplyFilter) {
      setShouldDisableApplyFilter(false);
    }
    const removedPlatformList = localSelectedOptionList.filter(
      (p) => getOptionValue(p) !== getOptionValue(platform)
    );
    if (removedPlatformList.length === localSelectedOptionList.length) {
      setLocalSelectedOptionList((old) => [...old, platform]);
    } else {
      setLocalSelectedOptionList(removedPlatformList);
    }
  };

  const handleClearFilter = () => {
    if (shouldDisableApplyFilter) {
      setShouldDisableApplyFilter(false);
    }
    setLocalSelectedOptionList([]);
    if (typeof onClearFilter === 'function') {
      onClearFilter();
      setIsPopOverOpen(false);
    }
  };

  const handleApplyFilter = () => {
    onApplyFilter(localSelectedOptionList);
    setIsPopOverOpen(false);
  };

  const optionsToRender = unionBy(localSelectedOptionList || [], options, getOptionValue);

  const handleCreateOption = async (query: string) => {
    if (!onCreateOption || typeof onCreateOption !== 'function') return;

    try {
      setIsCreatingOption(true);
      const newOption = await onCreateOption(query);
      setLocalSelectedOptionList((old) => [...old, newOption]);
      setSearchQuery('');
    } catch {
      toast({
        title: 'Failed',
        description: 'Failed to create option. Please try again.',
        toastType: 'destructive',
      });
    } finally {
      setIsCreatingOption(false);
    }
  };

  const renderEmptySearchView = () => {
    if (isCreatingOption) {
      return (
        <div className="flex-center gap-2 py-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating option...
        </div>
      );
    }
    if (searchQuery && onCreateOption) {
      return (
        <div className="flex-center flex-col gap-2">
          No result found.
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => handleCreateOption(searchQuery)}
          >
            Create it
          </Button>
        </div>
      );
    }
    return (
      <div className="flex-center gap-2 py-3">
        <Frown className="text-textSecondary h-4 w-4" />
        No result found.
      </div>
    );
  };

  useEffect(() => {
    if (commandListRef.current) {
      commandListRef.current.scrollTop = scrollPosition;
    }
  }, [localSelectedOptionList, scrollPosition]);

  return (
    <div className={cn('w-fit', classNames?.wrapper)}>
      <Popover
        open={isPopOverOpen}
        onOpenChange={(openStatus) => {
          setIsPopOverOpen(openStatus);
          setShouldDisableApplyFilter(true);
          setLocalSelectedOptionList(selectedOptions || []);
          setSearchQuery('');
        }}
      >
        <PopoverTrigger asChild className={cn(classNames?.selectTrigger)}>
          {renderTrigger(selectedOptions, isPopOverOpen)}
        </PopoverTrigger>
        <PopoverContent className={cn('w-fit bg-white p-0', classNames?.popoverContent)}>
          <Command>
            {shouldHideSearchInput ? null : (
              <CommandInput
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder={searchInputPlaceholder}
                className={cn(classNames?.commandInput)}
              />
            )}
            <CommandList className="max-h-full">
              <CommandEmpty className="p-1">{renderEmptySearchView()}</CommandEmpty>
              <CommandGroup
                className={cn('max-h-[220px] overflow-auto', classNames?.commandGroup)}
                ref={commandListRef}
              >
                {optionsToRender?.map((singlePlatform) => {
                  const isSelected =
                    localSelectedOptionList?.findIndex(
                      (v) => getOptionValue(v) === getOptionValue(singlePlatform)
                    ) !== -1;

                  return (
                    <CommandItem
                      className={cn(
                        'relative flex items-center gap-1 text-sm',
                        classNames?.commandItem
                      )}
                      key={getOptionValue(singlePlatform)}
                      onSelect={() => handleLocalPlatformSelect(singlePlatform)}
                    >
                      {renderOption(singlePlatform, isSelected)}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            {selectedOptions?.length || localSelectedOptionList?.length ? (
              <div className="flex justify-between border-t p-2">
                <Button
                  variant="ghost"
                  disabled={!localSelectedOptionList?.length}
                  size="sm"
                  onClick={handleClearFilter}
                >
                  Clear
                </Button>
                <PopoverClose asChild>
                  <Button size="sm" onClick={handleApplyFilter} disabled={shouldDisableApplyFilter}>
                    Apply
                  </Button>
                </PopoverClose>
              </div>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface MultiSelectOptionBadgeViewProps<TOption> {
  label: string;
  options: TOption[];
  getOptionLabel: (option: TOption) => string;
  onRemoveOption: (option: TOption) => void;
  minToolTipLength?: number;
}

export const MultiSelectOptionBadgeView = <TOption,>({
  label,
  options,
  getOptionLabel,
  onRemoveOption,
  minToolTipLength,
}: MultiSelectOptionBadgeViewProps<TOption>) => {
  if (!Array.isArray(options) || !options?.length) return null;
  const renderSingleOption = (singleOption: TOption) => {
    const optionLabel = getOptionLabel(singleOption);
    return (
      <div
        key={optionLabel}
        className="bg-background-hover text-textPrimary flex w-fit items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium"
      >
        {minToolTipLength ? (
          <TooltipProviderCustomised
            content={optionLabel}
            minContentLength={minToolTipLength}
            className="truncate"
          >
            {optionLabel?.length > minToolTipLength
              ? optionLabel.slice(0, minToolTipLength) + '...'
              : optionLabel}
          </TooltipProviderCustomised>
        ) : (
          optionLabel
        )}

        <button
          onClick={() => onRemoveOption(singleOption)}
          className="hover:bg-background-hover rounded-sm p-0.5"
        >
          <X
            strokeWidth={2.5}
            className="text-textPrimary-disable h-3.5 w-3.5 hover:text-red-500"
          />
        </button>
      </div>
    );
  };

  const renderOptions = () => {
    if (options.length === 1) {
      return renderSingleOption(options[0]);
    }

    return (
      <div className="flex flex-wrap gap-1">
        {renderSingleOption(options[0])}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="bg-background-hover h-6 border-none px-2 py-0 text-xs"
            >
              +{options.length - 1}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[150px] bg-white">
            <div className="flex flex-col flex-wrap gap-2">
              {options.slice(1).map(renderSingleOption)}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-textSecondary text-xs font-medium">{label}:</span>
      {renderOptions()}
    </div>
  );
};
