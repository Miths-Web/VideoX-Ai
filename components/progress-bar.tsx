"use client";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function ProgressBarWrapper() {
  return (
    <ProgressBar
      height="4px"
      color="#000"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}