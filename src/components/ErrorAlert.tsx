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
      className="flex gap-3 rounded-2xl border border-error/30 bg-error/10 px-4 py-4 text-error"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
}
