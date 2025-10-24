import * as React from 'react';

import { cn } from '@/lib/utils';
import { Badge } from './badge';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'aria-[invalid=true]:focus-visible:ring-0',
          'aria-[invalid=true]:border-border-destructive',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const InputWithCounter = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center gap-2">
        <input
          type={type}
          className={cn(
            'flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'aria-[invalid=true]:focus-visible:ring-0',
            'aria-[invalid=true]:border-border-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        <Badge
          variant={'outline'}
          className={cn(props.maxLength ? 'absolute right-0 top-0 mr-2 mt-2' : 'hidden')}
        >
          {typeof props.value === 'string' ? props.value.length : 0} / {props.maxLength}
        </Badge>
      </div>
    );
  }
);
InputWithCounter.displayName = 'InputWithCounter';

export { Input, InputWithCounter };
