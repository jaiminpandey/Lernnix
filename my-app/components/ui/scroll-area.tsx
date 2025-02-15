import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string; // ✅ Add className explicitly
}

export function Card({ children, className }: CardProps) {
  return <div className={cn("bg-white p-4 rounded-lg shadow-md", className)}>{children}</div>;
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn("border-b pb-2 mb-2", className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn("", className)}>{children}</div>;
}