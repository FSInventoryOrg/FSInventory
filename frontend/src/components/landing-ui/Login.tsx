import SignUpModal from '../auth-ui/SignUpModal'
import SignInModal from '../auth-ui/SignInModal'
import { Button } from '../ui/button'
// import { FacebookIcon } from '../icons/FacebookIcon'
import { GoogleIcon } from '../icons/GoogleIcon'
// import { AppleIcon } from '../icons/AppleIcon'

const Login = () => {
  return (
    <div className='w-full flex flex-col gap-6 items-center md:items-start'>
      <h1 className='text-6xl font-extrabold tracking-tightest text-center md:text-start'>Full Scale<span className="text-xs align-top">TM</span> Inventory</h1>
      <h3 className='text-4xl font-bold tracking-tighter italic'>Get sorted now.</h3>
      <div className='w-full max-w-xs flex flex-col gap-2'>
        <div className='w-full flex flex-col gap-2 mb-16'>
          <Button variant="outline" className='w-full text-md'><div className='flex items-center gap-2 text-md justify-start w-full mx-10'><GoogleIcon size={20}/>Sign up with Google</div></Button>
          {/* <Button variant="outline" className='w-full text-md'><div className='flex items-center gap-2 text-md justify-start w-full mx-10'><FacebookIcon size={20}/>Sign up with Facebook</div></Button>
          <Button variant="outline" className='w-full text-md'><div className='flex items-center gap-2 text-md justify-start w-full mx-10'><AppleIcon size={20}/>Sign up with Apple</div></Button> */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-muted-foreground"></div>
              <span className="flex-shrink mx-4 text-foreground">or</span>
            <div className="flex-grow border-t border-muted-foreground"></div>
          </div>
          <SignUpModal />
        </div>
        <p className='font-semibold mb-4'>Already have an account?</p>
        <SignInModal />
      </div>
    </div>
  )
}

export default Login