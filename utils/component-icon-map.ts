//Icons Map
const icons: {
  [key: string]: string;
} = {
  'nemo-font nemo-evolve2-tick': 'evolve2-tick',
  'nemo-font nemo-teacher-resource': 'teacher-resource',
  'nemo-font nemo-audio-product': 'audio-product',
  'nemo-font nemo-test-generator': 'test-generator',
  'nemo-font nemo-presentation': 'presentation',
  'nemo-font nemo-collaboration-plus': 'collaboration-plus',
  'nemo-font nemo-mock-test': 'mock-test',
  'nemo-font nemo-external-resource': 'external-resource',
  'nemo-font nemo-reading-negative': 'reading-negative-inverted',
  'nemo-font nemo-listening-negative': 'listening-negative-inverted',
  'nemo-font nemo-writing-negative': 'writing-negative-inverted',
  'nemo-font nemo-speaking-negative': 'speaking-negative-inverted',
  'nemo-font nemo-course-materials': 'ebook'
};

//Inverted icons map
const invertedIcons: { [key: string]: string } = {
  'nemo-font nemo-collaboration-plus': 'collaborationPlus-black',
  'nemo-font nemo-mock-test': 'mock-test-black',
  'nemo-font nemo-external-resource': 'externalResource-black'
};

/**
 * Util function comprising the MAP of icon name and the SVG *
 * Based on the icon name, return the SVG to be used for the component *
 *
 */
export const getIcon = (icon: string, isInverted = false) => {
  return isInverted ? invertedIcons[icon] : icons[icon];
};
