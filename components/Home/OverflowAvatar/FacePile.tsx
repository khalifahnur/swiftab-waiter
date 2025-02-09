export function renderFacePile(
  faces: { id: number; imageUrl: string }[] = [],
  numFaces: number
) {
  const entities = [...faces.reverse()];
  if (!entities.length) {
    return {
      facesToRender: [],
      overflow: 0,
    };
  }

  const facesWithImageUrls = entities.filter((e) => e.imageUrl);
  if (!facesWithImageUrls.length) {
    return {
      facesToRender: [],
      overflow: 0,
    };
  }

  const facesToRender = facesWithImageUrls.slice(0, numFaces);
  const overflow = entities.length - facesToRender.length;

  return {
    facesToRender,
    overflow,
  };
}
