import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, analyticsRes] = await Promise.all([
        axios.get('/api/courses/instructor/my-courses'),
        axios.get('/api/analytics/instructor/overview'),
      ]);
      setCourses(coursesRes.data.data.courses);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <Link
            to="/courses/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Create Course
          </Link>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Courses</h3>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalCourses}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalStudents}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900">${analytics.totalRevenue}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Average Rating</h3>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.averageRating.toFixed(1)} ⭐
              </p>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          {courses.length === 0 ? (
            <p className="text-gray-600">You haven't created any courses yet.</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {course.enrolledCount} students • {course.averageRating.toFixed(1)} ⭐
                      </p>
                    </div>
                    <Link
                      to={`/courses/${course._id}/edit`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

