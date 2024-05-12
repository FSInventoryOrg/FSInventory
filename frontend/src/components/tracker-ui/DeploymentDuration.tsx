import { useEffect, useState } from "react";
import { Spinner } from "../Spinner";

const DeploymentDuration = ({ deploymentDate }: { deploymentDate?: Date }) => {
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let intervalId: number;

    if (deploymentDate) {
      setIsLoading(true); // Set loading state to true when deploymentDate is available

      intervalId = setInterval(() => {
        const deploymentDateObj = new Date(deploymentDate);
        const currentTime = new Date();

        // Calculate the difference in milliseconds
        const diffInMs = currentTime.getTime() - deploymentDateObj.getTime();

        // Convert milliseconds to days, hours, minutes, and seconds
        const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

        // Construct the duration string
        const durationString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        setDuration(durationString);
        setIsLoading(false); // Set loading state to false when duration is calculated
      }, 1000); // Update every second
    }

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [deploymentDate]); // Run effect when deploymentDate changes

  return (
    <div className={`w-fit flex items-center text-start text-primary text-xs font-semibold justify-start`}>
      {isLoading ? (
        <Spinner className="text-primary h-5" size={14} /> // Show spinner while loading
      ) : (
        duration // Show duration if available
      )}
    </div>
  );
};

export default DeploymentDuration;
