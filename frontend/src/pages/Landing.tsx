import AppearanceMode from '@/components/AppearanceMode';
import { LoginScreen } from '@/components/landing-ui/LoginScreen';
import { Toaster } from '@/components/ui/toaster'

const Landing = () => {
  return (
    <div className='flex min-h-screen justify-center items-center'>
      <AppearanceMode />
      <LoginScreen />
      <Toaster />
    </div>
  )
}

export default Landing