import SignUpModal from '../auth-ui/SignUpModal'
import SignInModal from '../auth-ui/SignInModal'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query';
import * as imsService from '@/ims-service';
import { useEffect } from 'react';

const Login = () => {

  const { mutate } = useMutation({
    mutationFn: imsService.verifyOAuthCode,
    onSuccess: async (result: any) => { 
      if (result?.redirect) window.location.href = result.redirect
    }
  });

  useEffect(() => { 
    const queryParameters = new URLSearchParams(window.location.search)
    const code = queryParameters.get("code");

    if (code) mutate(code)
  }, []) 
  
  return (
    <div className='w-full flex flex-col gap-6 items-center md:items-start'>
      <h1 className='text-6xl font-extrabold tracking-tightest text-center md:text-start'>Full Scale<span className="text-xs align-top">TM</span> Inventory</h1>
      <h3 className='text-4xl font-bold tracking-tighter italic'>Get sorted now.</h3>
      <div className='w-full max-w-xs flex flex-col gap-2'>
        <div className='w-full flex flex-col gap-2 mb-16'>
          <SignInModal />
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-muted-foreground"></div>
              <span className="flex-shrink mx-4 text-foreground">or</span>
            <div className="flex-grow border-t border-muted-foreground"></div>
          </div>
          <Button variant="outline" className='w-full text-md' onClick={() => { imsService.oauthLogin() }}>Sign-in with Zoho</Button>
        </div>
        <p className='font-semibold mb-4'>Don't have an account?</p>
        <SignUpModal />
      </div>
    </div>
  )
}

export default Login