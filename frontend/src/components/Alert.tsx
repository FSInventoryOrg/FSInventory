import { AlertTriangleIcon, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface Props {
  message: string | null | undefined;
  type: "success" | "warning" | "error";
}

const CustomAlert = ({ type, message }: Props) => {
  type alertVariant =
    | "success"
    | "warning"
    | "destructive"
    | "default"
    | "destructiveOutline"
    | "warningOutline"
    | null
    | undefined;

  const getVariant = () => {
    if (type === "success") return { variant: "success", title: "Success" };
    if (type === "error") return { variant: "destructive", title: "Error" };
    if (type === "warning") return { variant: "warning", title: "Notice:" };
    return { variant: type, title: "" };
  };

  const alert = getVariant();

  return (
    <Alert variant={alert.variant as alertVariant}>
      {alert.variant === "success" ? (
        <Check className="h-4 w-4" />
      ) : (
        <AlertTriangleIcon className="h-4 w-4" />
      )}
      <AlertTitle>{alert.title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default CustomAlert;
