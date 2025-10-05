import { clsx, type ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type time = number;
type ms = time;

export function useDelay(time: ms, skipDelay: boolean = false) {
	const [delay, setDelay] = useState(true);

	useEffect(() => {
		if (skipDelay) {
			return;
		}
		setTimeout(() => setDelay(false), time);
	}, [skipDelay, time]);
	if (skipDelay) {
		false;
	}
	return delay;
}
