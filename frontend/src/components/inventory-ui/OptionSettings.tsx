import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { SlidersHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";

const OptionSettings = () => {
  const [open, setOpen] = useState(false); 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon' className="h-8 w-8">
        <span className="sr-only">Toggle option settings</span>
          <SlidersHorizontalIcon className='h-4 w-4'/>
          </Button>
      </DialogTrigger>
      <DialogContent className="bg-card overflow-y-scroll max-h-screen scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Option settings and preferences</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default OptionSettings;
