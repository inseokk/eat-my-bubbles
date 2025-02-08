const ZOOM_FACTOR = 0.15;

const zoomIn = document.getElementById('zoom-in');
const zoomOut = document.getElementById('zoom-out');

function getDocumentMiddle() {
  return pdfViewer.scrollTop + (pdfViewer.clientHeight / 2)
}

function roundBy(x, step, offset) {
  return Math.round((x - offset) / step) * step + offset;
}

zoomIn.addEventListener('click', () => {
  const scale = roundBy(pdfScale + ZOOM_FACTOR, 0.15, 10) / pdfScale;
  zoom(scale, null, getDocumentMiddle());
});
zoomOut.addEventListener('click', () => {
  const scale = roundBy(pdfScale - ZOOM_FACTOR, 0.15, 10) / pdfScale;
  zoom(scale, null, getDocumentMiddle());
});