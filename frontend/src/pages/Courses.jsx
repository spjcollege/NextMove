import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [activeCategory, activeDifficulty]);

  const fetchCourses = () => {
    setLoading(true);
    let url = "/courses/?";
    if (activeCategory) url += `category=${activeCategory}&`;
    if (activeDifficulty) url += `difficulty=${activeDifficulty}&`;
    apiFetch(url).then(setCourses).catch(() => { }).finally(() => setLoading(false));
  };

  const categories = ["", "openings", "middlegame", "endgame", "tactics", "strategy"];
  const difficulties = ["", "beginner", "intermediate", "advanced"];

  const getDifficultyColor = (d) => {
    const colors = { beginner: "badge-emerald", intermediate: "badge-blue", advanced: "badge-red" };
    return colors[d] || "badge-gold";
  };

  return (
    <div className="page animate-fade-in">
      <div className="section-header">
        <div>
          <h1>📚 Chess Courses</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            Learn from grandmasters — from beginner to advanced
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <div className="category-pills">
          {categories.map((c) => (
            <button key={c} className={`pill ${activeCategory === c ? "active" : ""}`} onClick={() => setActiveCategory(c)}>
              {c || "All Topics"}
            </button>
          ))}
        </div>
        <div className="category-pills">
          {difficulties.map((d) => (
            <button key={d} className={`pill ${activeDifficulty === d ? "active" : ""}`} onClick={() => setActiveDifficulty(d)}>
              {d || "All Levels"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid-courses">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280 }} />)}
        </div>
      ) : (
        <div className="grid-courses">
          {courses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="card" style={{
              padding: 0, overflow: "hidden", textDecoration: "none", color: "inherit",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{
                height: 140,
                background: `linear-gradient(135deg, ${course.is_free ? "rgba(16,185,129,0.15)" : "rgba(212,168,67,0.1)"} 0%, var(--bg-tertiary) 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem", position: "relative",
              }}>
                📚
                {course.is_free && (
                  <span className="badge badge-emerald" style={{ position: "absolute", top: 10, right: 10 }}>FREE</span>
                )}
              </div>

              <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <span className={`badge ${getDifficultyColor(course.difficulty)}`}>{course.difficulty}</span>
                  <span className="badge badge-gold">{course.category}</span>
                </div>

                <h3 style={{ fontSize: "1.05rem", marginBottom: 8 }}>{course.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", flex: 1, lineHeight: 1.5 }}>
                  {course.description?.slice(0, 100)}...
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>By {course.instructor}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                      {course.lesson_count} lessons · {course.duration}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, color: course.is_free ? "var(--brand-emerald)" : "var(--brand-gold)", fontSize: "1.1rem" }}>
                      {course.is_free ? "Free" : `₹${course.price}`}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{course.enrolled_count} enrolled</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
          <p style={{ fontSize: "2rem", marginBottom: 8 }}>📚</p>
          <p>No courses found with this filter.</p>
        </div>
      )}
    </div>
  );
}

export default Courses;