import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data.data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      setEnrolling(true);
      await axios.post('/api/enrollments', { courseId: id });
      alert('Enrolled successfully!');
      fetchCourse(); // Refresh course data
    } catch (error) {
      alert(error.response?.data?.error || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-gray-600">By {course.instructor?.name}</span>
              <span className="text-yellow-500">
                ⭐ {course.averageRating.toFixed(1)} ({course.totalReviews} reviews)
              </span>
              <span className="text-gray-600">{course.level}</span>
              <span className="text-blue-600 font-bold">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </span>
            </div>
            <p className="text-gray-700 mb-6">{course.description}</p>
            <div className="flex space-x-4">
              {!course.isEnrolled && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              {course.isEnrolled && (
                <Link
                  to={`/courses/${id}/learn`}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Continue Learning
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Curriculum */}
        {course.lessons && course.lessons.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Curriculum</h2>
            <div className="space-y-4">
              {course.lessons.map((lesson, index) => (
                <div key={lesson._id} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">
                    {lesson.sectionTitle} - {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-600">{lesson.duration} min</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;

