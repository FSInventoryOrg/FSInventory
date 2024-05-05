import Hero from '@/components/landing-ui/Hero'
import AppearanceMode from '@/components/AppearanceMode'

const Landing = () => {
  return (
    <div className='flex flex-col min-h-screen justify-center items-center'>
      <div className='absolute top-2 right-2 drop-shadow-md'>
        <AppearanceMode />
      </div>
      <Hero />
    </div>
  )
}

export default Landing