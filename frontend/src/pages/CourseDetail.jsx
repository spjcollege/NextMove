import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../App";

function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const { user, showToast } = useAuth();

    useEffect(() => {
        apiFetch(`/courses/${id}`).then(setCourse).catch(() => { });
        if (user) {
            apiFetch("/courses/user/enrolled")
                .then((list) => setEnrolled(list.some((c) => c.id === parseInt(id))))
                .catch(() => { });
        }
    }, [id, user]);

    const handleEnroll = async () => {
        if (!user) { showToast("Please login to enroll", "error"); return; }
        try {
            await apiFetch(`/courses/${id}/enroll`, { method: "POST" });
            setEnrolled(true);
            showToast("Enrolled successfully! 🎓");
        } catch (e) {
            showToast(e.message, "error");
        }
    };

    if (!course) {
        return <div className="page"><div className="skeleton" style={{ height: 400 }} /></div>;
    }

    return (
        <div className="page animate-slide-up" style={{ maxWidth: 900 }}>
            <Link to="/courses" style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>← Back to Courses</Link>

            <div style={{ marginTop: 20, marginBottom: 32 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <span className={`badge ${course.difficulty === "beginner" ? "badge-emerald" : course.difficulty === "intermediate" ? "badge-blue" : "badge-red"}`}>{course.difficulty}</span>
                    <span className="badge badge-gold">{course.category}</span>
                    {course.is_free && <span className="badge badge-emerald">FREE</span>}
                </div>

                <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>{course.title}</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 20 }}>
                    {course.description}
                </p>

                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 24, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <span>👨‍🏫 {course.instructor}</span>
                    <span>📖 {course.lesson_count} lessons</span>
                    <span>⏱ {course.duration}</span>
                    <span>👥 {course.enrolled_count} enrolled</span>
                </div>

                {!enrolled ? (
                    <button className="btn btn-primary btn-lg" onClick={handleEnroll}>
                        {course.is_free ? "Enroll for Free" : `Enroll — ₹${course.price}`}
                    </button>
                ) : (
                    <span className="badge badge-emerald" style={{ fontSize: "0.85rem", padding: "8px 16px" }}>✓ Enrolled</span>
                )}
            </div>

            {/* Lessons */}
            <h2 style={{ marginBottom: 16 }}>📖 Course Curriculum</h2>
            <div style={{ display: "grid", gap: 8 }}>
                {course.lessons?.map((lesson, i) => (
                    <div key={lesson.id} className="card" style={{
                        padding: "16px 20px",
                        display: "flex", alignItems: "center", gap: 16,
                        opacity: enrolled ? 1 : 0.6,
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "0.85rem", color: "var(--brand-gold)", flexShrink: 0,
                        }}>
                            {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: "0.9rem" }}>{lesson.title}</h4>
                            <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: 2 }}>
                                {lesson.duration_minutes} min
                                {lesson.fen_position && " · Interactive Board"}
                            </p>
                        </div>
                        {enrolled && (
                            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>▶</span>
                        )}
                        {!enrolled && (
                            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>🔒</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseDetail;
