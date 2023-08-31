/**
 * @file Defines reusable logic for managing dropdown state for several
 * components throughout the application.
 *
 * Is this the right abstraction? I dunno, but the basic version of the code
 * was copy-and-pasted seven different times throughout the codebase before I
 * extracted it out into a custom hook and cleaned it up for performance.
 *
 * Realistically, the better solution would be to create a reusable Dropdown
 * component that can then be composed around all the other components that are
 * consuming this hook right now.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useDropdownState() {
  /**
   * Very deliberately not exposing the raw setDropdownIsOpen state dispatch
   * outside this hook. The state should only be updated in a handful of
   * prescribed ways, which are defined via the exposed useCallback functions.
   */
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Applying useCallback to make sure that their memory references don't
   * change. This logic is used in a lot of places, and I don't want this hook
   * suddenly breaking useEffect calls or any component memoization (not that
   * there is any, I think)
   */
  const closeDropdown = useCallback(() => {
    setDropdownIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setDropdownIsOpen((current) => !current);
  }, []);

  // Adds listeners for auto-closing an open dropdown if you click outside it
  useEffect(() => {
    const onParentClick = (event: MouseEvent) => {
      const shouldClose =
        event.target instanceof HTMLElement &&
        !dropdownRef.current?.contains(event.target);

      if (shouldClose) {
        closeDropdown();
      }
    };

    document.addEventListener('click', onParentClick);
    return () => document.removeEventListener('click', onParentClick);

    /**
     * 2023-08-31 - Please do not remove closeDropdown from the dependency
     * array. This is the proper way of doing things; if the linter config
     * weren't busted, it would yell at you for trying to remove the value
     */
  }, [closeDropdown]);

  return {
    dropdownIsOpen,
    dropdownRef,
    closeDropdown,
    toggleDropdown,
  } as const;
}

