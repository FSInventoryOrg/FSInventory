import { AlertTriangleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface Props {
  errorMessage: string | null | undefined;
}

const ErrorAlert = ({ errorMessage }: Props) => {
  return (
    <Alert variant="destructive" className="bg-destructive/10">
      <AlertTriangleIcon className="h-4 w-4" />
      <AlertTitle className="font-semibold">Error</AlertTitle>
      <AlertDescription className="font-medium">
        {errorMessage}
      </AlertDescription>
    </Alert>
  )
}

export default ErrorAlert;
