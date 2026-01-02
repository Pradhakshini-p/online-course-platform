// backend/utils/helpers.js

// Utility helper functions

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const calculateProgress = (completedLessons, totalLessons) => {
  if (!totalLessons || totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

