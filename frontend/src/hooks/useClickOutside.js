import { useEffect } from 'react';

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // No hacer nada si el clic es dentro del elemento ref
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Volver a ejecutar solo si ref o handler cambian
}

export default useClickOutside;
