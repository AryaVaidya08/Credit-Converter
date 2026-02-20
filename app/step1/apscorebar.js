"use client"

import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./apscorebar.module.css";
import ApDropdown from "./apdropdown";

export default function ApScoreBar({
  apClasses = [],
  index = 1,
  selectedClass = "",
  isTaken = true,
  score = "",
  onClassChange,
  onTakenChange,
  onScoreChange,
  onEnter,
  onRemove,
  tableMode = false,
}) {
  function handleScoreChange(e) {
    const value = e.target.value;
    if (value === "" || /^[1-5]$/.test(value)) {
      onScoreChange?.(value);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  }

  // Sliding pill: a <span> moves left↔right behind the two text buttons
  const segmented = (
    <div className={styles.segmented}>
      <span className={`${styles.segSlider}${!isTaken ? ` ${styles.segSliderRight}` : ""}`} />
      <button
        type="button"
        className={`${styles.segOption}${isTaken ? ` ${styles.segActive}` : ""}`}
        onClick={() => onTakenChange?.(true)}
      >
        Taken
      </button>
      <button
        type="button"
        className={`${styles.segOption}${!isTaken ? ` ${styles.segActive}` : ""}`}
        onClick={() => onTakenChange?.(false)}
      >
        Predicted
      </button>
    </div>
  );

  // Table mode: render as a <tr> so the browser enforces column alignment
  if (tableMode) {
    return (
      <tr className={styles.tableRow}>
        <td className={styles.tdIndex}>{index}.</td>
        <td className={styles.tdName}>
          <ApDropdown
            options={apClasses}
            value={selectedClass}
            onChange={onClassChange}
            placeholder="Select AP Class"
            fullWidth
          />
        </td>
        <td className={styles.tdStatus}>
          {segmented}
        </td>
        <td className={styles.tdScore}>
          <input
            className={styles.scoreInput}
            placeholder="Score"
            value={score}
            onChange={handleScoreChange}
            onKeyDown={handleKeyDown}
          />
        </td>
        <td className={styles.tdDelete}>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={onRemove}
            disabled={!onRemove}
            title="Remove row"
          >
            <FaRegTrashAlt size={14} />
          </button>
        </td>
      </tr>
    );
  }

  // Standalone bar mode
  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        <div className={styles.index}>{index}.</div>
        <ApDropdown
          options={apClasses}
          value={selectedClass}
          onChange={onClassChange}
          placeholder="Select AP Class"
        />
        {segmented}
        <input
          className={styles.scoreInput}
          placeholder="Score"
          value={score}
          onChange={handleScoreChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
