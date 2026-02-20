"use client"

import { useState, useRef, useEffect } from "react";
import ApScoreBar from "./apscorebar";
import styles from "./apinputting.module.css";

const STORAGE_KEY = "apScores";

export default function ApInputting({ apClasses = [], onScoresChange }) {
  const [rows, setRows] = useState([{ id: 0, selectedClass: "", isTaken: true, score: "" }]);
  const nextId = useRef(1);
  const skipSave = useRef(true);

  // Notify parent + save to localStorage on every rows change
  useEffect(() => {
    if (onScoresChange) onScoresChange(rows);
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {}
  }, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRows(parsed);
          nextId.current = Math.max(...parsed.map(r => r.id), 0) + 1;
        }
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addRow() {
    setRows(prev => [...prev, { id: nextId.current++, selectedClass: "", isTaken: true, score: "" }]);
  }

  function removeRow(id) {
    setRows(prev => prev.filter(row => row.id !== id));
  }

  function updateRow(id, changes) {
    setRows(prev => prev.map(row => row.id === id ? { ...row, ...changes } : row));
  }

  return (
    // outer is position:relative for the floating button, no overflow:hidden
    <div className={styles.outer}>
      <button className={styles.addBtn} onClick={addRow} title="Add row">+</button>

      {/* tableCard has overflow:hidden + border-radius for the visual card */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colIndex} />
            <col className={styles.colName} />
            <col className={styles.colStatus} />
            <col className={styles.colScore} />
            <col className={styles.colDelete} />
          </colgroup>
          <thead>
            <tr>
              <th className={`${styles.th} ${styles.thIndex}`}>Test #</th>
              <th className={styles.th}>Test Name</th>
              <th className={styles.th}>Status</th>
              <th className={`${styles.th} ${styles.thScore}`}>Score</th>
              <th className={styles.th} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <ApScoreBar
                key={row.id}
                apClasses={apClasses}
                index={i + 1}
                selectedClass={row.selectedClass}
                isTaken={row.isTaken}
                score={row.score}
                onClassChange={(cls) => updateRow(row.id, { selectedClass: cls })}
                onTakenChange={(taken) => updateRow(row.id, { isTaken: taken })}
                onScoreChange={(sc) => updateRow(row.id, { score: sc })}
                onEnter={addRow}
                onRemove={rows.length > 1 ? () => removeRow(row.id) : null}
                tableMode
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
