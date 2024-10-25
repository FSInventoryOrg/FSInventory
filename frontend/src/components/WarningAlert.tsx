import { AlertTriangleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface Props {
  warningMessage: string | null | undefined;
}

const WarningAlert = ({ warningMessage }: Props) => {
  return (
    <Alert className="warning-alert">
      <AlertTriangleIcon className="h-4 w-4" color="#675211" />
      <AlertTitle>Notice:</AlertTitle>
      <AlertDescription>
        {warningMessage}
      </AlertDescription>
    </Alert>
  )
}

export default WarningAlert;
