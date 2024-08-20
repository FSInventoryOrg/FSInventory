import SignUpModal from '../auth-ui/SignUpModal';
import SignInModal from '../auth-ui/SignInModal';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as imsService from '@/ims-service';
import { useEffect, useState } from 'react';
import { Spinner } from '../Spinner';
import { useAppContext } from '@/hooks/useAppContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const code = new URLSearchParams(window.location.search)?.get('code');
  const { mutate: verifyOAuthCode } = useMutation({
    mutationFn: imsService.verifyOAuthCode,
    onSuccess: async (result: any) => {
      console.log(result.redirect);
      if (result?.redirect) {
        navigate('/');
        showToast({
          message: 'You have logged in to the session.',
          type: 'SUCCESS',
        });
        queryClient.invalidateQueries({ queryKey: ['validateToken'] });
      }
    },
    onError: async () => {
      setIsLoading(false);
    },
  });

  const { mutate: oauthLogin, isPending: isLoginPending } = useMutation({
    mutationFn: imsService.oauthLogin,
  });

  useEffect(() => {
    if (code) {
      setIsLoading(true);
      verifyOAuthCode(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className='w-full flex flex-col gap-6 items-center md:items-start'>
      <h1 className='text-6xl font-extrabold tracking-tightest text-center md:text-start'>
        Full Scale<span className='text-xs align-top'>TM</span> Inventory
      </h1>
      <h3 className='text-4xl font-bold tracking-tighter italic'>
        Get sorted now.
      </h3>
      {isLoading ? (
        <Spinner size={64} />
      ) : (
        <div className='w-full max-w-xs flex flex-col gap-2'>
          <div className='w-full flex flex-col gap-2 mb-16'>
            <SignInModal />
            <div className='relative flex py-5 items-center'>
              <div className='flex-grow border-t border-muted-foreground'></div>
              <span className='flex-shrink mx-4 text-foreground'>or</span>
              <div className='flex-grow border-t border-muted-foreground'></div>
            </div>
            <Button
              disabled={isLoginPending}
              variant='outline'
              className='w-full text-md'
              onClick={() => {
                oauthLogin();
              }}
            >
              {isLoginPending ? <Spinner size={18} /> : null}
              Sign-in with Zoho
            </Button>
          </div>
          <p className='font-semibold mb-4'>Don't have an account?</p>
          <SignUpModal />
        </div>
      )}
    </div>
  );
};

export default Login;
