import { AlertTriangleIcon, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface Props {
  message: string | null | undefined;
  type: "success" | "warning" | "error";
  hideTitle?: boolean;
}

const CustomAlert = ({ type, message, hideTitle = false }: Props) => {
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
    if (type === "error") return { variant: "error", title: "Error" };
    if (type === "warning") return { variant: "warning", title: "Notice:" };
    return { variant: type, title: "" };
  };

  const alert = getVariant();

  return (
    <Alert
      variant={alert.variant as alertVariant}
      className="flex gap-3 align-middle items-center text-center"
    >
      {alert.variant === "success" ? (
        <Check className="h-4 w-4" />
      ) : (
        <AlertTriangleIcon color="#F33535" className="h-4 w-4" />
      )}
      {!hideTitle && <AlertTitle>{alert.title}</AlertTitle>}
      <AlertDescription className="flex items-center text-center align-middle">
        <p>{message}</p>
      </AlertDescription>
    </Alert>
  );
};

export default CustomAlert;
