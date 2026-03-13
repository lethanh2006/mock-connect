import { useState } from 'react';

export const useCooldown = (initialCooldown: number) => {
  const [countdown, setCountdown] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const startCooldown = () => {
    setDisabled(true);
    setCountdown(initialCooldown);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDisabled(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  return { countdown, disabled, startCooldown };
};