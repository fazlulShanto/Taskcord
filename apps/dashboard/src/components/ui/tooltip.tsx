import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/lib/utils';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

type TooltipProviderCustomProps = {
  content: React.ReactNode;
  asChild?: boolean;
  side?: 'top' | 'left' | 'bottom' | 'right';
  cursorType?: 'pointer' | 'default';
  minContentLength?: number;
  className?: string;
  align?: 'center' | 'end' | 'start' | undefined;
  ref?: React.Ref<React.ElementRef<typeof TooltipPrimitive.TooltipProvider>>;
} & React.ComponentPropsWithoutRef<typeof TooltipPrimitive.TooltipProvider>;

const TooltipProviderCustomised = ({
  side,
  content,
  children,
  delayDuration = 0,
  asChild = false,
  cursorType,
  className,
  minContentLength = 0,
  align,
  ref: _ref,
  ...props
}: TooltipProviderCustomProps) => {
  const hasMinimumContentLength = typeof content === 'string' && minContentLength >= content.length;
  if (!content || hasMinimumContentLength) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <TooltipPrimitive.TooltipProvider delayDuration={delayDuration} {...props}>
      <TooltipPrimitive.Tooltip>
        <TooltipPrimitive.TooltipTrigger
          asChild={asChild}
          className={`${cursorType ? `cursor-${cursorType}` : ''}`}
        >
          {children}
        </TooltipPrimitive.TooltipTrigger>
        <TooltipContent
          className={cn('max-w-[300px] bg-[#18181B]', className)}
          side={side}
          align={align}
        >
          {content}
        </TooltipContent>
      </TooltipPrimitive.Tooltip>
    </TooltipPrimitive.TooltipProvider>
  );
};
TooltipProviderCustomised.displayName = 'TooltipProviderCustomised';

export { Tooltip, TooltipContent, TooltipProvider, TooltipProviderCustomised, TooltipTrigger };
