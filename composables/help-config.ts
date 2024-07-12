export const useHelpConfig = () => {
  const HELP_PAGE_MAP = {
    prod1: {
      learner_understandingData: '4410819490066-Understanding-the-data',
      teacher_understandingData: '4410743080210-Understanding-the-data',
      learner_practiceTestScores:
        '4411089956882-Understanding-your-Test-Train-Timed-Practice-Test-scores',
      teacher_practiceTestScores:
        '4410612486162-Understanding-Test-Train-Timed-Practice-Test-scores',
      ielts: '4410106166930-IELTS-Intelligence'
    },
    default: {
      learner_understandingData: '4410848542226-Understanding-the-data',
      teacher_understandingData: '4405381750162-Understanding-the-data',
      learner_practiceTestScores:
        '4411124450194-Understanding-your-Test-Train-Timed-Practice-Test-scores',
      teacher_practiceTestScores:
        '4405380464274-Understanding-your-Test-Train-Timed-Practice-Test-scores',
      ielts: '4407581188498-IELTS-Intelligence'
    }
  };

  /* Get the Help Page property */
  const getHelpPagePath = (
    environment: string,
    category?: string,
    article?: string
  ) => {
    let helpPagePath = useRuntimeConfig().public.zendeskBasePath;
    if (category) {
      if (article) {
        // @ts-ignore
        const articlePath = (HELP_PAGE_MAP[environment] ||
          HELP_PAGE_MAP.default)[`${category}_${article}`];
        if (articlePath) helpPagePath += '/articles/' + articlePath;
      } else {
        // @ts-ignore
        const categoryPath = (HELP_PAGE_MAP[environment] ||
          HELP_PAGE_MAP.default)[category];
        if (categoryPath) helpPagePath += '/categories/' + categoryPath;
      }
    }
    return helpPagePath;
  };

  return { getHelpPagePath };
};
