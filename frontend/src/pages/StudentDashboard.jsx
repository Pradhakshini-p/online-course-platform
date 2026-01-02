import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('/api/enrollments/my-courses');
      setEnrollments(response.data.data.enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {enrollment.course?.thumbnail && (
                  <img
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {enrollment.course?.title}
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{enrollment.courseProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${enrollment.courseProgress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    to={`/courses/${enrollment.courseId._id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Continue Learning →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

