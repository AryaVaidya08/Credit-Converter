"use client"

import { useState } from "react";
import apData from "../db/final_ap_data.json";
import styles from "./results.module.css";

// Map page.js AP class names -> database key names where they differ
const NAME_MAP = {
  "Precalculus": "Pre-Calculus",
  "World History Modern": "World History: Modern",
  "Physics C Electricity and Magnetism": "Physics C: Electricity and Magnetism",
  "Physics C Mechanics": "Physics C: Mechanics",
};

function dbName(apClass) {
  return NAME_MAP[apClass] ?? apClass;
}

// Given a college's course entry array and user score, find the best qualifying tier
function bestTier(courseEntries, userScore) {
  const numScore = parseInt(userScore, 10);
  if (isNaN(numScore) || !Array.isArray(courseEntries)) return null;

  let best = null;
  for (const tier of courseEntries) {
    const required = parseInt(tier["Score Required"], 10);
    if (required <= numScore) {
      if (!best || required > parseInt(best["Score Required"], 10)) {
        best = tier;
      }
    }
  }
  return best;
}

function calculateCredits(collegeData, validScores) {
  let takenCredits = 0;
  let predictedCredits = 0;
  const breakdown = [];

  for (const row of validScores) {
    const key = dbName(row.selectedClass);
    const courseEntries = collegeData[key];
    if (!courseEntries) continue; // college doesn't offer credit for this course

    const tier = bestTier(courseEntries, row.score);
    const credits = tier ? (parseInt(tier["Credits Given"], 10) || 0) : 0;

    if (tier) {
      if (row.isTaken) takenCredits += credits;
      predictedCredits += credits;
    }

    breakdown.push({
      apName: row.selectedClass,
      isTaken: row.isTaken,
      score: row.score,
      scoreRequired: tier ? parseInt(tier["Score Required"], 10) : null,
      creditsGiven: credits,
      noCredit: !tier,
    });
  }

  return { takenCredits, predictedCredits, breakdown };
}

function CollegeCard({ college, validScores }) {
  const [expanded, setExpanded] = useState(false);
  const collegeData = apData[college.uuid];

  if (!collegeData) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.collegeName}>{college.name}</span>
          <span className={styles.noData}>No credit data available</span>
        </div>
      </div>
    );
  }

  const { takenCredits, predictedCredits, breakdown } = calculateCredits(collegeData, validScores);
  const hasBreakdown = breakdown.length > 0;

  return (
    <div className={styles.card}>
      <div
        className={`${styles.cardHeader}${hasBreakdown ? ` ${styles.cardHeaderClickable}` : ""}`}
        onClick={hasBreakdown ? () => setExpanded(e => !e) : undefined}
      >
        <span className={styles.collegeName}>{college.name}</span>
        <div className={styles.chips}>
          <span className={styles.takenChip}>
            Taken: {takenCredits} credits
          </span>
          <span className={styles.predictedChip}>
            Predicted: {predictedCredits} credits
          </span>
        </div>
        {hasBreakdown && (
          <svg
            className={`${styles.chevron}${expanded ? ` ${styles.chevronOpen}` : ""}`}
            width="14" height="14" viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {expanded && hasBreakdown && (
        <div className={styles.breakdown}>
          <table className={styles.breakdownTable}>
            <thead>
              <tr>
                <th>AP Course</th>
                <th>Status</th>
                <th>Your Score</th>
                <th>Min Score Required</th>
                <th>Credits Given</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, i) => (
                <tr key={i} className={item.noCredit ? styles.rowNoCredit : ""}>
                  <td>{item.apName}</td>
                  <td>
                    <span className={item.isTaken ? styles.takenBadge : styles.predictedBadge}>
                      {item.isTaken ? "Taken" : "Predicted"}
                    </span>
                  </td>
                  <td>{item.score}</td>
                  <td>{item.noCredit ? "—" : item.scoreRequired}</td>
                  <td>{item.noCredit ? <span className={styles.scoreTooLow}>Score too low</span> : item.creditsGiven}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Results({ apScores, selectedColleges }) {
  const validScores = apScores.filter(row => row.selectedClass && row.score);

  if (validScores.length === 0 && selectedColleges.length === 0) {
    return (
      <div className={styles.placeholder}>
        Add your AP scores and colleges above to see results.
      </div>
    );
  }

  if (validScores.length === 0) {
    return (
      <div className={styles.placeholder}>
        Please enter at least one AP class with a score.
      </div>
    );
  }

  if (selectedColleges.length === 0) {
    return (
      <div className={styles.placeholder}>
        Please add at least one college above.
      </div>
    );
  }

  return (
    <div className={styles.results}>
      {selectedColleges.map(college => (
        <CollegeCard key={college.uuid} college={college} validScores={validScores} />
      ))}
    </div>
  );
}
