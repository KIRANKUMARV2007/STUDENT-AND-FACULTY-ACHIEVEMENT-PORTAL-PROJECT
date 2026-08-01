import { supabase } from '../supabaseClient';

/**
 * Fetches achievements for a specific student.
 * @param {string} userId - The UUID of the logged-in student.
 * @returns {Promise<Array>} - Array of achievement objects.
 */
export const fetchAchievements = async (userId) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('achievements')
    .select(`
      id,
      title,
      description,
      status,
      created_at,
      achievement_categories (name)
    `)
    .eq('student_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[achievementUtils] Error fetching achievements:', error);
    throw error;
  }

  return data || [];
};

/**
 * Calculates achievement statistics from an array of achievements.
 * @param {Array} achievements - Array of achievement objects.
 * @returns {Object} - An object containing total, approved, pending, and rejected counts.
 */
export const calculateAchievementStats = (achievements) => {
  const total = achievements.length;
  const approved = achievements.filter((a) => a.status === 'Approved').length;
  const pending = achievements.filter((a) => a.status === 'Pending').length;
  const rejected = achievements.filter((a) => a.status === 'Rejected').length;

  console.log('[achievementUtils] Total achievements fetched:', total);
  console.log('[achievementUtils] Approved count:', approved);
  console.log('[achievementUtils] Pending count:', pending);
  console.log('[achievementUtils] Rejected count:', rejected);

  return { total, approved, pending, rejected };
};

/**
 * Returns a badge name based on total points.
 * @param {number} points - Total points earned.
 * @returns {string} - Badge name (None, Bronze, Silver, Gold, Platinum).
 */
export const getBadgeForPoints = (points) => {
  if (points >= 2500) return 'Platinum';
  if (points >= 1000) return 'Gold';
  if (points >= 500) return 'Silver';
  if (points >= 100) return 'Bronze';
  return 'None';
};
