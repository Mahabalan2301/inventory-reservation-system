import { AlertCircle } from "lucide-react";

type ErrorAlertProps = {
  title?: string;
  message: string;
};

export function ErrorAlert({ title = "Error", message }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-error"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-sm text-error/90">{message}</p>
      </div>
    </div>
  );
}
