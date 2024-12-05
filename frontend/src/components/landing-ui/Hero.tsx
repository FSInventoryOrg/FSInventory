import React from "react";
import { FullScaleIcon } from "../icons/FullScaleIcon";
import Login from "./Login";

const Hero = () => {
  const [isMD, setIsMD] = React.useState(false);
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMD(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <section className="flex flex-col md:flex-row w-full justify-center">
      <div className="w-full md:w-full flex justify-center items-center">
        <div className="flex flex-col items-center w-20 md:w-full p-0 md:p-16 lg-24 xl:p-48">
          {/* <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className='' viewBox="0 0 425.178 425.178" xmlSpace="preserve">
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
          </svg> */}
          {isMD ? (
            <FullScaleIcon size={400} className="fill-current text-primary" />
          ) : (
            <FullScaleIcon size={100} className="fill-current text-primary" />
          )}
          <span className="hidden md:block text-7xl font-bold tracking-tighter">
            stockpilot :)
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center p-3">
        <Login />
      </div>
    </section>
  );
};

export default Hero;
