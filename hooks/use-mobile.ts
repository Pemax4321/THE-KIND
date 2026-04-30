// Custom hook to detect if the device is mobile based on window width
import * as React from 'react'

// Breakpoint for mobile detection (matches Tailwind's md breakpoint)
const MOBILE_BREAKPOINT = 768

// Hook that returns true if the viewport width is less than 768px (mobile)
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined) // Undefined until mounted

  React.useEffect(() => {
    // Create media query listener for mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Update state when window is resized or orientation changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Attach listener for media query changes
    mql.addEventListener('change', onChange)
    
    // Set initial value on mount
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup: remove listener on unmount
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Return boolean (coerce undefined to false with !!)
  return !!isMobile
}
