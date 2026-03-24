import { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/courses/")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const subscribe = async (courseId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Login required");
      return;
    }

    await fetch("http://127.0.0.1:8000/courses/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user.email,
        course_id: courseId
      })
    });

    alert("Subscribed successfully!");
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl mb-6">Chess Courses</h2>

      {courses.map(course => (
        <div key={course.id} className="border p-4 mb-4 rounded">

          <h3 className="font-bold text-lg">{course.title}</h3>

          <p>₹{course.price}</p>
          <p>{course.duration}</p>

          <ul className="text-sm mt-2">
            {course.content.map((c, i) => (
              <li key={i}>• {c}</li>
            ))}
          </ul>

          <button
            onClick={() => subscribe(course.id)}
            className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Subscribe
          </button>

        </div>
      ))}
    </div>
  );
}

export default Courses;