import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Anything, Anytime
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover thousands of courses from expert instructors
            </p>
            <div className="space-x-4">
              <Link
                to="/courses"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
              >
                Browse Courses
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-800 transition"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">
              Learn from industry professionals with real-world experience
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed progress tracking
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">Quality Courses</h3>
            <p className="text-gray-600">
              Access high-quality content with student reviews and ratings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

