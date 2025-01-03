import { useState, useEffect } from "react";
const Clock = () => {
    const [time, setTime] = useState({ hour: new Date().getHours(), minute: new Date().getMinutes() });
  
    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        setTime({ hour: now.getHours(), minute: now.getMinutes() });
      }, 60000); // Update every minute
  
      return () => clearInterval(interval); // Cleanup interval
    }, []);
  
    return (
      <>
        {time.hour.toString().padStart(2, "0")}:{time.minute.toString().padStart(2, "0")}
      </>
    );
  };
export default Clock;