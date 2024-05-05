import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SlidersHorizontalIcon } from "lucide-react"

const EditConfig = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="secondary"
          size="icon"
          className="ml-auto rounded-xl"
        >
          <SlidersHorizontalIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditConfig