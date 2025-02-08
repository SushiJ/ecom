import { clsx, type ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type time = number;
type ms = time;

export function useDelay(time: ms) {
  const [delay, setDelay] = useState(true);

  useEffect(() => {
    setTimeout(() => setDelay(false), time);
  }, []);
  return delay;
}
