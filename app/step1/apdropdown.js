"use client"

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./apdropdown.module.css";

export default function ApDropdown({ options = [], value = "", onChange, placeholder = "Select...", fullWidth = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  function openMenu() {
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  function toggle() {
    if (isOpen) closeMenu();
    else openMenu();
  }

  // Close on outside click or scroll
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      closeMenu();
    }
    function handleScroll(e) {
      // Don't close when scrolling within the menu itself
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      closeMenu();
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const isPlaceholder = !value;

  return (
    <div className={`${styles.wrapper}${fullWidth ? ` ${styles.fullWidth}` : ""}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger}${isOpen ? ` ${styles.triggerOpen}` : ""}`}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={isPlaceholder ? styles.placeholder : styles.selected}>
          {value || placeholder}
        </span>
        <svg
          className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ""}`}
          width="12" height="12" viewBox="0 0 12 12" fill="none"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div ref={menuRef} className={styles.menu} style={menuStyle} role="listbox">
          {/* Placeholder / clear option */}
          <button
            type="button"
            className={`${styles.option}${!value ? ` ${styles.optionSelected}` : ` ${styles.optionClear}`}`}
            onClick={() => { onChange(""); closeMenu(); }}
          >
            <span>{placeholder}</span>
          </button>

          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.option}${opt === value ? ` ${styles.optionSelected}` : ""}`}
              onClick={() => { onChange(opt); closeMenu(); }}
              role="option"
              aria-selected={opt === value}
            >
              <span>{opt}</span>
              {opt === value && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 7l3.5 3.5L11 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
