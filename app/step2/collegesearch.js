"use client"

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./collegesearch.module.css";
import searchData from "../db/ap_search_data.json";

// Parse "College Name, City, ST" keys into structured objects
const ALL_COLLEGES = Object.entries(searchData).map(([key, uuid]) => {
  const lastComma = key.lastIndexOf(", ");
  const state = key.slice(lastComma + 2);
  const rest = key.slice(0, lastComma);
  const secondLastComma = rest.lastIndexOf(", ");
  const city = rest.slice(secondLastComma + 2);
  const name = rest.slice(0, secondLastComma);
  return { name, city, state, uuid };
});

const ALL_STATES = [...new Set(ALL_COLLEGES.map(c => c.state))].sort();

export default function CollegeSearch({ selectedColleges = [], onAddCollege, onRemoveCollege }) {
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [stateMenuStyle, setStateMenuStyle] = useState({});

  const searchWrapRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const stateTriggerRef = useRef(null);
  const stateMenuRef = useRef(null);

  const selectedUuids = useMemo(
    () => new Set(selectedColleges.map(c => c.uuid)),
    [selectedColleges]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && !selectedState) return [];
    return ALL_COLLEGES.filter(c => {
      if (selectedUuids.has(c.uuid)) return false;
      if (selectedState && c.state !== selectedState) return false;
      if (q) return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
      return true;
    }).slice(0, 60);
  }, [query, selectedState, selectedUuids]);

  const showDropdown = dropdownOpen && (results.length > 0 || query.trim().length > 0);

  function handleInputFocus() {
    setDropdownOpen(true);
  }

  function handleInputChange(e) {
    setQuery(e.target.value);
    setDropdownOpen(true);
  }

  function addCollege(college) {
    onAddCollege?.(college);
    setQuery("");
    setDropdownOpen(false);
    inputRef.current?.focus();
  }

  function openStateMenu() {
    const rect = stateTriggerRef.current.getBoundingClientRect();
    setStateMenuStyle({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    setStateOpen(true);
  }

  function toggleState() {
    if (stateOpen) setStateOpen(false);
    else openStateMenu();
  }

  // Close search results on outside click
  useEffect(() => {
    function handle(e) {
      if (
        searchWrapRef.current && !searchWrapRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Close state menu on outside click / scroll
  useEffect(() => {
    if (!stateOpen) return;
    function handleClick(e) {
      if (
        stateTriggerRef.current && !stateTriggerRef.current.contains(e.target) &&
        stateMenuRef.current && !stateMenuRef.current.contains(e.target)
      ) {
        setStateOpen(false);
      }
    }
    function handleScroll(e) {
      if (stateMenuRef.current && stateMenuRef.current.contains(e.target)) return;
      setStateOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [stateOpen]);

  return (
    <div className={styles.outer}>

      {/* ── Search row ── */}
      <div className={styles.searchRow}>

        {/* Text search */}
        <div className={styles.searchWrap} ref={searchWrapRef}>
          <div className={styles.searchIconWrap}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="#b0b0b0" strokeWidth="1.7" />
              <path d="M10.5 10.5L13.5 13.5" stroke="#b0b0b0" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="Search colleges by name or city…"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Results dropdown */}
          {showDropdown && (
            <div ref={dropdownRef} className={styles.resultsDropdown}>
              {results.length === 0 ? (
                <div className={styles.noResults}>No colleges found</div>
              ) : (
                results.map(c => (
                  <button
                    key={c.uuid}
                    type="button"
                    className={styles.resultItem}
                    onMouseDown={() => addCollege(c)}
                  >
                    <span className={styles.resultName}>{c.name}</span>
                    <span className={styles.resultMeta}>{c.city}, {c.state}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* State filter */}
        <button
          ref={stateTriggerRef}
          type="button"
          className={`${styles.stateTrigger}${stateOpen ? ` ${styles.stateTriggerOpen}` : ""}`}
          onClick={toggleState}
          aria-expanded={stateOpen}
          aria-haspopup="listbox"
        >
          <span className={selectedState ? styles.stateSelected : styles.statePlaceholder}>
            {selectedState || "All States"}
          </span>
          <svg
            className={`${styles.chevron}${stateOpen ? ` ${styles.chevronOpen}` : ""}`}
            width="12" height="12" viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {stateOpen && typeof document !== "undefined" && createPortal(
          <div ref={stateMenuRef} className={styles.stateMenu} style={stateMenuStyle} role="listbox">
            <button
              type="button"
              className={`${styles.stateOption}${!selectedState ? ` ${styles.stateOptionSelected}` : ` ${styles.stateOptionClear}`}`}
              onClick={() => { setSelectedState(""); setStateOpen(false); }}
            >
              <span>All States</span>
            </button>
            {ALL_STATES.map(st => (
              <button
                key={st}
                type="button"
                className={`${styles.stateOption}${st === selectedState ? ` ${styles.stateOptionSelected}` : ""}`}
                onClick={() => { setSelectedState(st); setStateOpen(false); setDropdownOpen(true); }}
                role="option"
                aria-selected={st === selectedState}
              >
                <span>{st}</span>
                {st === selectedState && (
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

      {/* ── Selected colleges table ── */}
      {selectedColleges.length > 0 && (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <colgroup>
              <col className={styles.colIndex} />
              <col className={styles.colName} />
              <col className={styles.colCity} />
              <col className={styles.colState} />
              <col className={styles.colDelete} />
            </colgroup>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles.thIndex}`}>#</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>City</th>
                <th className={styles.th}>State</th>
                <th className={styles.th} />
              </tr>
            </thead>
            <tbody>
              {selectedColleges.map((c, i) => (
                <tr key={c.uuid} className={styles.tableRow}>
                  <td className={styles.tdIndex}>{i + 1}.</td>
                  <td className={styles.tdName}>{c.name}</td>
                  <td className={styles.tdCity}>{c.city}</td>
                  <td className={styles.tdState}>{c.state}</td>
                  <td className={styles.tdDelete}>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => onRemoveCollege?.(c.uuid)}
                      title="Remove college"
                    >
                      <FaRegTrashAlt size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
