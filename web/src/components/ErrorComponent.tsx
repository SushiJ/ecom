import { AlertTriangle } from "lucide-react";

type ErrorProps = {
	error?: {
		message: string;
		path: string;
	};
};

export default function ErrorComponent({ error }: ErrorProps) {
	return (
		<div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
			<AlertTriangle className="h-10 w-10 text-red-500" />
			<h2 className="mt-2 text-lg font-semibold text-red-700">
				Looks like this path {error?.path} doesn't exist on this page
			</h2>
			<p className="mt-1 text-sm text-red-600">
				{error?.message || "An unexpected error occurred. Please try again."}
			</p>
		</div>
	);
}
