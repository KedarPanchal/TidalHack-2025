/**
 * Utility functions for managing sobriety timer
 */

/**
 * Shows a gentle confirmation dialog asking if the user wants to reset their journey
 * This function should be called when a relapse is detected
 */
export function confirmRelapseReset(): Promise<boolean> {
  return new Promise((resolve) => {
    const confirmed = window.confirm(
      "It looks like you may have experienced a relapse. Would you like to reset your sobriety journey and start fresh?\n\n" +
      "This will clear your current progress and start a new timer. You can always continue your current journey if you prefer."
    );
    resolve(confirmed);
  });
}

/**
 * Resets the sobriety timer by updating the start time in localStorage
 * This function should be called when a relapse is detected and confirmed
 */
export function resetSobrietyTimer(): void {
  const now = Date.now();
  localStorage.setItem('sobrietyStartTime', now.toString());
  
  // Clear any existing check-in data since we're starting fresh
  localStorage.removeItem('lastCheckIn');
  localStorage.removeItem('lastCheckInWindow');
  
  // Dispatch a custom event to notify components of the reset
  window.dispatchEvent(new CustomEvent('sobrietyTimerReset', { 
    detail: { newStartTime: now } 
  }));
  
  console.log('Sobriety timer reset to:', new Date(now).toLocaleString());
}

/**
 * Handles relapse detection with user confirmation
 * Shows a gentle dialog and only resets if the user confirms
 */
export async function handleRelapseDetection(): Promise<void> {
  const shouldReset = await confirmRelapseReset();
  
  if (shouldReset) {
    resetSobrietyTimer();
    
    // Show a supportive message after reset
    setTimeout(() => {
      alert(
        "Your journey has been reset. Remember, every step forward is progress. " +
        "You've got this! 💪"
      );
    }, 100);
  } else {
    console.log('User chose not to reset their journey');
  }
}

/**
 * Gets the current sobriety start time from localStorage
 * @returns The start time in milliseconds, or null if not set
 */
export function getSobrietyStartTime(): number | null {
  const saved = localStorage.getItem('sobrietyStartTime');
  return saved ? parseInt(saved) : null;
}

/**
 * Checks if the sobriety timer has been set
 * @returns true if the timer has been initialized, false otherwise
 */
export function isSobrietyTimerSet(): boolean {
  return getSobrietyStartTime() !== null;
}
