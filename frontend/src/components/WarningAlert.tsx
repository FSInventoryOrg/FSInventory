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
    <Alert variant="warning">
      <AlertTriangleIcon className="h-4 w-4 " />
      <AlertTitle>Notice:</AlertTitle>
      <AlertDescription>
        {warningMessage}
      </AlertDescription>
    </Alert>
  )
}

export default WarningAlert;
