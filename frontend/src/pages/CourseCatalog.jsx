import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: '',
    sort: 'newest',
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await axios.get(`/api/courses?${params.toString()}`);
      setCourses(response.data.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Catalog</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search courses..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Design">Design</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {course.instructor?.name || 'Instructor'}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {course.averageRating.toFixed(1)} ({course.totalReviews})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </p>
                      <p className="text-xs text-gray-500">{course.level}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;

