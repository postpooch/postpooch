"use client";

import { Component, type ReactNode } from "react";

type PreviewRenderBoundaryProps = {
  children: ReactNode;
  resetKey: string;
};

type PreviewRenderBoundaryState = {
  error: Error | null;
};

function isNotFoundError(error: Error): boolean {
  if (error.message.includes("NEXT_HTTP_ERROR_FALLBACK;404")) return true;
  if (error.message.includes("NEXT_NOT_FOUND")) return true;
  const digest = (error as Error & { digest?: string }).digest;
  return typeof digest === "string" && digest.includes("404");
}

export class PreviewRenderBoundary extends Component<
  PreviewRenderBoundaryProps,
  PreviewRenderBoundaryState
> {
  state: PreviewRenderBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): PreviewRenderBoundaryState {
    return { error };
  }

  componentDidUpdate(prevProps: PreviewRenderBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-dvh place-items-center bg-white px-8 text-center text-sm leading-6 text-pp-coral">
          {isNotFoundError(this.state.error)
            ? "No matching catalog item for this preview. Add an item to the catalog or choose another page."
            : "This preview could not be rendered."}
        </div>
      );
    }

    return this.props.children;
  }
}
