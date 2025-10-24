import { Link } from '@tanstack/react-router';

export default function PageNotFound() {
  return (
    <div className="bg-background flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <SpaceIcon className="text-primary mx-auto h-24 w-24" />
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Oops, looks like you've landed on the wrong planet!
        </h1>
        <p className="text-muted-foreground mt-4">
          The page you're looking for seems to have drifted off into the cosmos. But don't worry,
          we've got your back!
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="#"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            to="/"
          >
            Take me back home
          </Link>
          <Link
            href="#"
            className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            to="/"
          >
            Explore our galaxy
          </Link>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SpaceIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
    </svg>
  );
}
