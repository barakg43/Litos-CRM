import { useToast } from "@chakra-ui/react";

export function useToaster() {
  const toast = useToast();
  function toaster({
    title,
    description,
    status,
    duration,
  }: {
    title: string;
    description: string;
    status: "info" | "warning" | "success" | "error" | "loading" | undefined;
    duration?: number;
  }) {
    toast({ title, description, status, duration: duration || 5000 });
  }

  return toaster;
}
