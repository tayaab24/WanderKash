"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export default function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format: (n: number) => string;
}) {
  const shown = useRef(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(shown.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => {
        shown.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value]);

  return <>{format(Math.round(display))}</>;
}