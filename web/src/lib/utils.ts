import { clsx, type ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type time = number;
type ms = time;

export function useDelay(time: ms, skipDelay: boolean = false) {
	if (skipDelay) {
		return false;
	} 
	const [delay, setDelay] = useState(true);

	useEffect(() => {
		setTimeout(() => setDelay(false), time);
	}, []);
	return delay
}
