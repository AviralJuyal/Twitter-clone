# Save User preferences

A composable which can be used by any Page / Component to save/persist
user preferences data to the backend.

## How to use this composable

Include the following code in your Component / Page.

```ts
// Import Types - Preferences
import type { PrefsTeacherClassesDashboard } from '@c1/dashboard.types.ui';


// Handle user event
const onSaveSomething = () => {
    //We need to persist/save user's selections

    /** Step 1. 
     * 
     * Save the user's data/selection in an object (types/ui/persistent-preferences).
     * 
     * If an appropriate type does not exist, make one first.
     * Also, appropriately update the following files:
     * - Route handler (server/api/save-user-preferences.post.ts)
     * - Command "cmdSavePreferences" (types/domain/commands/save-user-preferences.ts)
     * - Domain Service "savePrefrences" function (domain-services/save-user-preferences.ts)
     * - Users mapper (mappers/users/persistent-preferences)
     */
    const userPreferences: PrefsTeacherClassesDashboard = {
        type: PersistentPrefTypes.TeacherClassesDashboard,
        data: {
            // User's selections
        }
    };

    /** Step 2.
     * 
     * Use the composable to POST to the server.
     * 
     */

    await useUserPreferences().saveUserPreference(
        userPreferences
    );

}
```