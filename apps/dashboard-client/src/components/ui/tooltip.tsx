import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

type TooltipProviderCustomProps = {
  content: React.ReactNode;
  asChild?: boolean;
  side?: 'top' | 'left' | 'bottom' | 'right';
  cursorType?: 'pointer' | 'default';
  minContentLength?: number;
  className?: string;
  align?: 'center' | 'end' | 'start' | undefined;
} & React.ComponentPropsWithoutRef<typeof TooltipPrimitive.TooltipProvider>;

const TooltipProviderCustomised = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.TooltipProvider>,
  TooltipProviderCustomProps
>(
  (
    {
      side,
      content,
      children,
      delayDuration = 0,
      asChild = false,
      cursorType,
      className,
      minContentLength = 0,
      align,
      ...props
    },
    _ref
  ) => {
    const hasMinimumContentLength =
      typeof content === 'string' && minContentLength >= content.length;
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
  }
);

export { Tooltip, TooltipContent, TooltipProvider, TooltipProviderCustomised, TooltipTrigger };
