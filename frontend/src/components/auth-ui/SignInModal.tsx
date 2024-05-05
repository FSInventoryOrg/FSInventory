import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import SignInForm from './SignInForm'
import ErrorAlert from '../ErrorAlert'
import { useState } from 'react'

const SignInModal = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const handleErrorAlert = (errorMessage: string | null) => {
    setErrorMessage(errorMessage)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='font-bold text-md' variant="secondary">Sign in</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="grid grid-flow-row grid-cols-1 p-2">
            <DialogTitle className='flex justify-center items-center my-2 '>
              <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800" height="50" viewBox="0 0 425.178 425.178" xmlSpace="preserve">
                <g>
                  <g>
                    <rect y="361.617" width="39.447" height="39.449"/>
                    <rect y="313.412" width="39.447" height="39.433"/>
                    <rect y="265.183" width="39.447" height="39.441"/>
                    <rect y="216.969" width="39.447" height="39.449"/>
                    <rect y="168.746" width="39.447" height="39.447"/>
                    <rect y="120.537" width="39.447" height="39.443"/>
                    <rect y="72.323" width="39.447" height="39.447"/>
                    <rect y="24.112" width="39.447" height="39.447"/>
                    <rect x="48.218" y="361.617" width="39.447" height="39.449"/>
                    <rect x="48.218" y="313.412" width="39.447" height="39.433"/>
                    <rect x="48.218" y="265.183" width="39.447" height="39.441"/>
                    <rect x="48.218" y="216.969" width="39.447" height="39.449"/>
                    <rect x="48.218" y="168.746" width="39.447" height="39.447"/>
                    <rect x="96.435" y="361.617" width="39.439" height="39.449"/>
                    <rect x="96.435" y="313.412" width="39.439" height="39.433"/>
                    <rect x="96.435" y="265.183" width="39.439" height="39.441"/>
                    <rect x="144.645" y="361.617" width="39.447" height="39.449"/>
                    <rect x="144.645" y="313.412" width="39.447" height="39.433"/>
                    <rect x="144.645" y="265.183" width="39.447" height="39.441"/>
                    <rect x="144.645" y="216.969" width="39.447" height="39.449"/>
                    <rect x="144.645" y="168.746" width="39.447" height="39.447"/>
                    <rect x="144.645" y="120.537" width="39.447" height="39.443"/>
                    <rect x="192.859" y="361.617" width="39.445" height="39.449"/>
                    <rect x="192.859" y="313.412" width="39.445" height="39.433"/>
                    <rect x="241.085" y="361.617" width="39.441" height="39.449"/>
                    <rect x="241.085" y="313.412" width="39.441" height="39.433"/>
                    <rect x="241.085" y="265.183" width="39.441" height="39.441"/>
                    <rect x="241.085" y="216.969" width="39.441" height="39.449"/>
                    <rect x="241.085" y="168.746" width="39.441" height="39.447"/>
                    <rect x="241.085" y="120.537" width="39.441" height="39.443"/>
                    <rect x="241.085" y="72.323" width="39.441" height="39.447"/>
                    <rect x="289.299" y="361.617" width="39.444" height="39.449"/>
                    <rect x="337.504" y="361.617" width="39.453" height="39.449"/>
                    <rect x="337.504" y="313.412" width="39.453" height="39.433"/>
                    <rect x="337.504" y="265.183" width="39.453" height="39.441"/>
                    <rect x="385.725" y="361.617" width="39.453" height="39.449"/>
                    <rect x="385.725" y="313.412" width="39.453" height="39.433"/>
                    <rect x="385.725" y="265.183" width="39.453" height="39.441"/>
                    <rect x="385.725" y="216.969" width="39.453" height="39.449"/>
                  </g>
                </g>
              </svg>
            </DialogTitle>
          </div>
          <DialogDescription className='flex flex-col gap-4'>
            <span className='w-full flex justify-center text-xl text-primary font-semibold'>Enter your account</span>
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col w-full justify-center px-8 md:px-16 pb-12 gap-4'>
          {errorMessage ? <ErrorAlert errorMessage={errorMessage}/> : null}
          <SignInForm onError={handleErrorAlert} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignInModal;

