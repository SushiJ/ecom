import { cn } from "@/lib/utils";

export function Title(props: { title: string; className?: string }) {
  return (
    <h1 className={cn("italic my-8 text-sm text-center", props.className)}>
      {props.title}
    </h1>
  );
}
