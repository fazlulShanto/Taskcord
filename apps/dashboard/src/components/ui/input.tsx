import * as React from 'react';

import { cn } from '@/lib/utils';
import { Badge } from './badge';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

const InputWithCounter = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center gap-2">
        <input
          type={type}
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-10 w-full rounded-md border px-3 py-2 text-base focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'aria-invalid:focus-visible:ring-0',
            'aria-invalid:border-border-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        <Badge
          variant={'outline'}
          className={cn(props.maxLength ? 'absolute top-0 right-0 mt-2 mr-2' : 'hidden')}
        >
          {typeof props.value === 'string' ? props.value.length : 0} / {props.maxLength}
        </Badge>
      </div>
    );
  }
);
InputWithCounter.displayName = 'InputWithCounter';

export { Input, InputWithCounter };
