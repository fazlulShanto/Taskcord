import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React from 'react';
import {
  Toaster as Sonner,
  toast as sonnerToast,
  ToasterProps,
  useSonner,
  type ExternalToast,
} from 'sonner';

const SonnerToaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      duration={3 * 1000} // 3seconds
      swipeDirections={['right']} // swipe to dismiss
      visibleToasts={4} // how many toast can be visible at the same time on hover
      {...props}
    />
  );
};

const useSonnerToast = () => {
  const { toasts } = useSonner();

  const dismissAllToast = () => {
    return sonnerToast.dismiss();
  };

  const updateToast = (id: string | number, content: string) => {
    if (!id) return;
    const targetToast = toasts.find((toast) => toast.id === id);
    if (!targetToast) {
      return;
    }
    sonnerToast(content, {
      id: targetToast.id,
    });
  };

  const deleteToast = (id: string | number) => {
    if (!id) return;
    sonnerToast.dismiss(id);
  };

  return {
    visibleToasts: toasts,
    dismissAllToast,
    deleteToast,
    updateToast,
  };
};

interface ToastProps extends ExternalToast {
  id: string | number;
  title?: string | React.ReactElement;
  description: string | React.ReactElement;
  onClose?: () => void;
  toastType?: 'default' | 'destructive' | 'success';
}

/** A fully custom toast that still maintains the animations and interactions but comes with our own design */
function Toast({ id, title, description, onClose, toastType = 'default' }: ToastProps) {
  const renderToastButtons = () => {
    return (
      <button
        className={cn(
          'bg-background-hover hidden h-8 w-8 items-center justify-center rounded-md group-hover:flex',
          {
            'border border-[#FF5757] bg-transparent': toastType === 'destructive',
          }
        )}
        onClick={() => {
          if (typeof onClose === 'function') {
            onClose();
          }
          sonnerToast.dismiss(id);
        }}
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>
    );
  };

  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <p
          className={cn('text-textPrimary text-sm font-semibold', {
            'text-primary': toastType === 'success',
            'text-white': toastType === 'destructive',
          })}
        >
          {title}
        </p>
      );
    }
    if (React.isValidElement(title)) {
      return title;
    }
    return null;
  };

  const renderDescription = () => {
    if (typeof description === 'string') {
      return (
        <p
          className={cn('text-textPrimary text-sm font-normal', {
            'text-white': toastType === 'destructive',
            'font-medium': !title,
          })}
        >
          {description}
        </p>
      );
    }
    if (React.isValidElement(description)) {
      return description;
    }
    return null;
  };

  return (
    <div
      className={cn(
        'group relative h-auto w-[384px] rounded-md border border-border bg-white p-4 shadow-xl',
        {
          'bg-[#D70000] text-white': toastType === 'destructive',
        }
      )}
    >
      <div className="absolute right-3 top-3">{renderToastButtons()}</div>
      <div className={'flex w-full flex-col justify-end gap-1'}>
        {renderTitle()}
        {renderDescription()}
      </div>
    </div>
  );
}

function toast({
  title,
  description,
  action = undefined,
  onClose,
  toastType,
  ...rest
}: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <Toast
      {...rest}
      id={id}
      title={title}
      description={description}
      action={action}
      onClose={onClose}
      toastType={toastType}
    />
  ));
}

export { SonnerToaster, toast, useSonnerToast };
