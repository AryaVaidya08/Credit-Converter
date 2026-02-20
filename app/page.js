"use client"

import { useState } from "react";
import styles from "./page.module.css";
import Header from "./components/header";
import Footer from "./components/footer";
import ApInputting from "./step1/apinputting";
import CollegeSearch from "./step2/collegesearch";
import Results from "./step3/results";

const AP_CLASSES = [
  "2-D Art and Design",
  "3-D Art and Design",
  "African American Studies",
  "Art History",
  "Biology",
  "Calculus AB",
  "Calculus BC",
  "Chemistry",
  "Chinese Language and Culture",
  "Comparative Government and Politics",
  "Computer Science A",
  "Computer Science Principles",
  "Drawing",
  "English Language and Composition",
  "English Literature and Composition",
  "Environmental Science",
  "European History",
  "French Language and Culture",
  "German Language and Culture",
  "Human Geography",
  "Italian Language and Culture",
  "Japanese Language and Culture",
  "Latin",
  "Macroeconomics",
  "Microeconomics",
  "Music Theory",
  "Physics 1",
  "Physics 2",
  "Physics C Electricity and Magnetism",
  "Physics C Mechanics",
  "Precalculus",
  "Psychology",
  "Research",
  "Seminar",
  "Spanish Language and Culture",
  "Spanish Literature and Culture",
  "Statistics",
  "United States Government and Politics",
  "United States History",
  "World History Modern",
];

export default function Home() {
  const [apScores, setApScores] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);

  function handleAddCollege(college) {
    setSelectedColleges(prev => [...prev, college]);
  }

  function handleRemoveCollege(uuid) {
    setSelectedColleges(prev => prev.filter(c => c.uuid !== uuid));
  }

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <div className={styles.stepBadge}>1</div>
          <h2 className={styles.stepTitle}>Input Your AP Scores</h2>
        </div>
        <ApInputting apClasses={AP_CLASSES} onScoresChange={setApScores} />
      </div>

      <div className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <div className={styles.stepBadge}>2</div>
          <h2 className={styles.stepTitle}>Choose Your Colleges</h2>
        </div>
        <CollegeSearch
          selectedColleges={selectedColleges}
          onAddCollege={handleAddCollege}
          onRemoveCollege={handleRemoveCollege}
        />
      </div>

      <div className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <div className={styles.stepBadge}>3</div>
          <h2 className={styles.stepTitle}>View the Results</h2>
        </div>
        <Results apScores={apScores} selectedColleges={selectedColleges} />
      </div>

      <Footer />
    </div>
  );
}
