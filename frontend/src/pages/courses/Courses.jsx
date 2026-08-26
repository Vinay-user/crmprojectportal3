import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

import courseService from "../../services/courseService";
import DataTable from "../../components/tables/DataTable";
import CourseForm from "./CourseForm";
import { formatCurrency } from "../../utils/formatters";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      setError("");

      const response = await courseService.list();

      setCourses(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsFormOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      setError("");
      await courseService.remove(courseId);
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (err) {
      setError("Failed to delete course");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedCourse?.id) {
        const response = await courseService.update(selectedCourse.id, formData);
        setCourses(courses.map((c) =>
          c.id === selectedCourse.id ? response.data : c
        ));
      } else {
        const response = await courseService.create(formData);
        setCourses([response.data, ...courses]);
      }

      setIsFormOpen(false);
      setSelectedCourse(null);
    } catch (err) {
      setError(selectedCourse?.id ? "Failed to update course" : "Failed to create course");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = courses.filter((course) =>
    `${course.name || ""} ${course.code || ""} ${course.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Course"
    },
    {
      key: "code",
      label: "Code"
    },
    {
      key: "category",
      label: "Category"
    },
    {
      key: "durationHours",
      label: "Duration",
      render: (value) => (value ? `${value} hrs` : "-")
    },
    {
      key: "fee",
      label: "Fee",
      render: (value, row) => formatCurrency(value, row.currency || "USD")
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span className="status-badge">
          {value ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="icon-button edit-button"
            onClick={() => handleEditCourse(row)}
            title="Edit course"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteCourse(row.id)}
            title="Delete course"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Courses</h2>
          <p>
            Manage the IT training course catalog.
          </p>
        </div>

        <button className="primary-button" onClick={handleAddCourse}>
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              placeholder="Search courses..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
        />
      </div>

      <CourseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCourse(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedCourse}
        loading={formLoading}
      />
    </div>
  );
}
