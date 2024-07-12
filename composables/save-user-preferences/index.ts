// IMPORTS

// Types - Preferences
import type {
  PrefsTeacherClassesDashboard,
  PrefsTeacherTrainingDashboard,
  PrefsTeacherClass
} from '@c1/dashboard.types.ui';

// Composable to help saving the user preferences
export const useUserPreferences = () => {
  /**
   * Save the user preference to the server.
   *
   * Note that if the preferences are not present, it creates a new one.
   * If the preferences are present, it overwrites the existing one.
   *
   * @param preferences - The preferences which need to be saved
   * @returns A promise which resolves to True if the user preference was saved successfully.
   */
  const saveUserPreference = async (
    preferences:
      | PrefsTeacherClassesDashboard
      | PrefsTeacherTrainingDashboard
      | PrefsTeacherClass
  ) => {
    // Post the user preference to the server.
    await useFetchHelper().fetchOnCSR('/api/save-user-preferences', {
      method: 'POST',
      body: preferences
    });

    return true;
  };

  return {
    saveUserPreference
  };
};
