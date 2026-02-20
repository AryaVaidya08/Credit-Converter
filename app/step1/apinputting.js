"use client"

import { useState, useRef, useEffect } from "react";
import ApScoreBar from "./apscorebar";
import styles from "./apinputting.module.css";

export default function ApInputting({ apClasses = [], onScoresChange }) {
  const [rows, setRows] = useState([{ id: 0, selectedClass: "", isTaken: true, score: "" }]);
  const nextId = useRef(1);

  useEffect(() => {
    if (onScoresChange) onScoresChange(rows);
  }, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

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
