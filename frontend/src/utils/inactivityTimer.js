let inactivityTimeout;
let countdownTimeout;
let remainingTime;

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimeout);
  clearTimeout(countdownTimeout);

  const inactivityDuration =
    Number(process.env.NEXT_PUBLIC_LOGOUT_TIMER) * 60000; // TIMER minutes in milliseconds
  remainingTime = inactivityDuration;

  const startCountdown = () => {
    const updateRemainingTime = () => {
      if (remainingTime <= 0) {
        // Perform logout or other actions after inactivity
        return;
      }

      remainingTime -= 1000; // Decrease remaining time by 1 second
      countdownTimeout = setTimeout(updateRemainingTime, 1000);
    };

    updateRemainingTime();

    // Add event listeners for user activity
    document.addEventListener("mousemove", resetInactivityTimer);
    document.addEventListener("keydown", resetInactivityTimer);
  };

  inactivityTimeout = setTimeout(startCountdown, inactivityDuration);
};

const getRemainingTime = () => {
  return remainingTime;
};

export { resetInactivityTimer, getRemainingTime };
