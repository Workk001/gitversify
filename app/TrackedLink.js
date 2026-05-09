"use client";

import { track } from "@vercel/analytics";

export default function TrackedLink({
  event,
  properties,
  children,
  onClick,
  ...props
}) {
  function handleClick(e) {
    if (event) {
      track(event, properties);
    }

    onClick?.(e);
  }

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
