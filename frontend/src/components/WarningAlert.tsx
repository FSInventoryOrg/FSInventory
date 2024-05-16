import { AlertTriangleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface Props {
  warningMessage: string | null | undefined;
  variant?: "warning" | "warningOutline";
}

const WarningAlert = ({ warningMessage, variant="warning" }: Props) => {
  return (
    <Alert variant={variant}>
      <AlertTriangleIcon className="h-4 w-4 " />
      <AlertTitle className="font-semibold">Warning</AlertTitle>
      <AlertDescription className="font-medium">
        {warningMessage}
      </AlertDescription>
    </Alert>
  )
}

export default WarningAlert;
