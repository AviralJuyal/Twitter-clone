// IMPORTS

// Types - Statements
import {
  type XAPIStatement,
  type XAPIActor,
  type ActivityXAPIObject,
  type ComponentXAPIObject,
  type ComponentAttachmentXAPIObject,
  type XAPIDownloadedVerb,
  type XAPIAccessedVerb,
  type XAPILaunchedVerb,
  type XAPIContext,
  C1_BASE_URL,
  XAPI_BASE_URL
} from '@c1/dashboard.types.statement-events';

// Composable to help with statements
export const useStatementsHelper = () => {
  /**
   * Prepare the XAPI Verb object based on the action being performed
   * @param action - The action being performed
   */
  const createStatementVerb = (
    action: 'downloaded' | 'accessed' | 'launched'
  ): XAPIDownloadedVerb | XAPIAccessedVerb | XAPILaunchedVerb => {
    switch (action) {
      case 'downloaded': {
        return {
          id: `${XAPI_BASE_URL}/verbs/downloaded`,
          display: {
            und: 'downloaded'
          }
        };
      }
      case 'accessed': {
        return {
          id: `${XAPI_BASE_URL}/verbs/accessed`,
          display: {
            und: 'accessed'
          }
        };
      }
      case 'launched': {
        return {
          id: `${XAPI_BASE_URL}/verbs/launched`,
          display: {
            und: 'launched'
          }
        };
      }
    }
  };

  /**
   * Prepare the XAPI Object object based on the activity being acted upon
   * - Refer to {@see ActivityXAPIObject} for details
   *
   * @param id - The activity id
   * @param name - The name of the activity
   * @param extensions - Additional attributes for the activity
   */
  const createActivityXAPIObject = (
    id: string,
    name: string,
    extensions: {
      componentCode: string;
      activityType: string;
      activitySubType?: string;
      activityExtUrl?: string;
      objectTags?: string[];
      componentTags?: string[];
    }
  ): ActivityXAPIObject => {
    return {
      id,
      definition: {
        name: {
          und: name
        },
        type: `${XAPI_BASE_URL}/activity`,
        extensions: {
          [`${C1_BASE_URL}/extension/activityType`]: extensions.activityType,
          [`${C1_BASE_URL}/extension/activitySubType`]:
            extensions.activitySubType,
          [`${C1_BASE_URL}/extension/activityExtUrl`]: extensions.activityExtUrl
        }
      },
      extensions: {
        [`${C1_BASE_URL}/extension/objectTags`]: extensions.objectTags,
        [`${C1_BASE_URL}/extension/componentCode`]: extensions.componentCode,
        [`${C1_BASE_URL}/extension/componentTags`]: extensions.componentTags
      }
    };
  };

  /**
   * Prepare the XAPI Object object based on the component being acted upon
   * - Refer to {@see ComponentXAPIObject} for details
   *
   * @param id - The component code
   * @param name - The name of the component
   * @param extensions - Additional attributes for the component
   */
  const createComponentXAPIObject = (
    id: string,
    name: string,
    extensions: {
      objectTags?: string[];
    }
  ): ComponentXAPIObject => {
    return {
      id,
      definition: {
        name: {
          und: name
        },
        type: `${C1_BASE_URL}/extension/component`
      },
      extensions: {
        [`${C1_BASE_URL}/extension/objectTags`]: extensions.objectTags
      }
    };
  };

  /**
   * Prepare the XAPI Object object based on the component attachment
   *  being acted upon
   * - Refer to {@see ComponentAttachmentXAPIObject} for details
   *
   * @param id - The unique identifier for the component attachment
   * @param name - The name of the component attachment
   * @param extensions - Additional attributes for the component attachment
   */
  const createComponentAttachmentXAPIObject = (
    id: string,
    name: string,
    extensions: {
      componentCode: string;
      componentAttachmentFileName: string;
      targetPlatform: 'Windows' | 'MacOS' | 'Linux';
      objectTags?: string[];
      componentTags?: string[];
    }
  ): ComponentAttachmentXAPIObject => {
    return {
      id,
      definition: {
        name: {
          und: name
        },
        type: `${C1_BASE_URL}/extension/componentAttachment`,
        extensions: {
          [`${C1_BASE_URL}/extension/componentAttachmentFileName`]:
            extensions.componentAttachmentFileName,
          [`${C1_BASE_URL}/extension/targetPlatform`]: extensions.targetPlatform
        }
      },
      extensions: {
        [`${C1_BASE_URL}/extension/objectTags`]: extensions.objectTags,
        [`${C1_BASE_URL}/extension/componentCode`]: extensions.componentCode,
        [`${C1_BASE_URL}/extension/componentTags`]: extensions.componentTags
      }
    };
  };

  /**
   * Helper function to create statement structure and publish the statement to the backend
   * @param verb - The action being performed
   * - For details, refer to {@link XAPIDownloadedVerb}, {@link XAPIAccessedVerb}, {@link XAPILaunchedVerb}
   * @param object - The entity being acted upon
   * - For details, refer to {@link XAPIObject}
   * @param context - Additional attributes for the action
   * - For details, refer to {@link XAPIContext}
   */
  const publishStatement = async (
    verb: 'downloaded' | 'accessed' | 'launched',
    object:
      | ActivityXAPIObject
      | ComponentXAPIObject
      | ComponentAttachmentXAPIObject,
    context: {
      schoolId: string;
      classId?: string;
      skipForProgress?: boolean;
    }
  ) => {
    // Get the user data from the store
    const userData = useAuthenticateStore();

    // Prepare the XAPI Actor
    const xapiActor: XAPIActor = {
      objectType: 'Agent',
      role: userData?.role ?? '',
      account: {
        homePage: C1_BASE_URL,
        id: userData?.userId ?? ''
      }
    };

    // Prepare the XAPI Verb
    const xapiVerb = createStatementVerb(verb);

    /**
     * Prepare the XAPI Context
     * - Fill in the platform and browser values
     */
    const xapiContext: XAPIContext = {
      platform: 'Browser',
      extensions: {
        [`${C1_BASE_URL}/extension/browser`]: navigator.userAgent,
        [`${C1_BASE_URL}/extension/schoolId`]: context.schoolId,
        [`${C1_BASE_URL}/extension/classId`]: context.classId,
        [`${C1_BASE_URL}/extension/skipForProgress`]: context.skipForProgress
      }
    };

    // Prepare the XAPI Statement
    const statement: XAPIStatement = {
      actor: xapiActor,
      verb: xapiVerb,
      context: xapiContext,
      object,
      timestamp: Date.now()
    };

    /**
     * Post the statement to the backend.
     * Fire & Forget (ignore any errors on the client side)
     */
    await useFetchHelper().fetchOnCSR('/api/beacon/publish-statement', {
      method: 'POST',
      body: statement
    });

    return true;
  };

  return {
    publishStatement,
    createStatementVerb,
    createActivityXAPIObject,
    createComponentXAPIObject,
    createComponentAttachmentXAPIObject
  };
};
