import { Component, type ErrorInfo, type ReactNode } from "react";
import { ServerCrash } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled application error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-ink-950">
          <ServerCrash className="mb-6 h-14 w-14 text-red-500" aria-hidden="true" />
          <h1 className="text-2xl font-bold sm:text-3xl">Something went wrong.</h1>
          <p className="mt-2 max-w-sm text-ink-500 dark:text-ink-400">Please try refreshing the page, or come back later.</p>
          <button
            onClick={() => window.location.assign("/")}
            className="mt-6 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
