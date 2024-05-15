import { Toaster } from "@/components/ui/toaster"
import LoadingBar from 'react-top-loading-bar';
import { useEffect, useState } from 'react';
import NavigationBar from "@/components/NavigationBar";

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateProgress = () => {
    setProgress(0); // Set initial progress value
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 100; // Increase progress by 10% in each interval
      });
    }, 500); // Change interval duration as needed
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    const removeListener = () => {
      simulateProgress();
    };
    simulateProgress();
    return () => {
      removeListener();
    };
    
  }, []);

  return (
    <div className="w-full flex flex-col items-center relative">
      <LoadingBar color="lime" className="text-muted" progress={progress} onLoaderFinished={() => setProgress(0)} />
      <header className={`w-full justify-center flex fixed top-0 bg-background z-40 ${scrolled ? "drop-shadow-lg z-50" : "drop-shadow-none"}`}>
        <NavigationBar />
      </header>
      <div className="flex flex-col sm:flex-row mt-[89px] w-full overflow-auto relative z-40" style={{ minHeight: 'calc(100vh - 89px)' }}>
        <main className="flex-1">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

export default Layout