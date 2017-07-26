const colorsOffsets = {
  't': 6232,
  'w': 6395,
  'v': 6352,
};
function findSkinTypeMarker(data) {
  const typeMarker = data.readUInt8(39);
  if (typeMarker === 119) return 'w';
  if (typeMarker === 116) return 't';
  return 'v';
}
function findSkinType(data) {
	const skinType = { marker: findSkinTypeMarker(data) };
  skinType.isLive9 = (skinType.marker === 'w' ? null : (skinType.marker === 't'));
	skinType.colorsOffset = colorsOffsets[skinType.marker];
	return skinType;
}
function skinType(marker) {
  return {
    marker,
    colorsOffset: colorsOffsets[marker],
  };
}

module.exports = { findSkinType, skinType };