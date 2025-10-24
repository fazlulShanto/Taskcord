import { Link } from '@tanstack/react-router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ErrorBoundary({ error }: { error: any }) {
  const errorText = (error as Error).stack?.split('\n')?.at(0) || '';
  let errorLocation = (error as Error).stack?.split('\n')?.at(1) || '';
  errorLocation = errorLocation.replace('(', '');

  console.log('Error🛑', error as Error);
  return (
    <div className="flex min-h-[100dvh] w-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops, something went wrong!
        </h1>
        <p className="mt-4 text-muted-foreground">
          We're sorry, but an unexpected error has occurred. Please try again later or contact
          support if the issue persists.
        </p>
        <div>
          <p>{errorText}</p>
          <p>{errorLocation}</p>
        </div>
        <div className="mt-6">
          <Link
            to={'/'}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
