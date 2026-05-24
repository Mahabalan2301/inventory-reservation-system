import { AlertCircle } from "lucide-react";

type ErrorAlertProps = {
  title?: string;
  message: string;
};

export function ErrorAlert({
  title = "Something went wrong",
  message,
}: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="flex gap-4 rounded-2xl border border-error/40 bg-error/15 px-6 py-5 text-error backdrop-filter backdrop-blur-sm"
    >
      <AlertCircle className="mt-0.5 h-6 w-6 shrink-0" />
      <div className="flex-1">
        <p className="font-bold text-base">{title}</p>
        <p className="mt-1 text-sm text-error/90 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
