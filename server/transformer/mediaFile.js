export const mediaFileTransformer = (file) => {
  return {
    id: file.id,
    url: file.url,
  };
};
