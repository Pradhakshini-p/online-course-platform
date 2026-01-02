import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    avatar: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfile(response.data.data);
      setFormData({
        name: response.data.data.user.name,
        bio: response.data.data.user.bio || '',
        skills: response.data.data.user.skills?.join(', ') || '',
        avatar: response.data.data.user.avatar || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      await axios.put('/api/profile', {
        ...formData,
        skills: skillsArray,
      });
      setEditing(false);
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {profile?.user.name}
                </h2>
                <p className="text-gray-600">{profile?.user.email}</p>
                <p className="text-gray-600 capitalize">{profile?.user.role}</p>
              </div>
              {profile?.user.bio && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                  <p className="text-gray-700">{profile.user.bio}</p>
                </div>
              )}
              {profile?.user.skills && profile.user.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

