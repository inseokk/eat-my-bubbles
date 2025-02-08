// var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';

const { pdfjsLib } = globalThis;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

var pdf;
var pdfScale = 1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 2.0;

const pdfViewer = document.getElementById('pdf-viewer');
const pages = document.getElementById('pages');
const pageNumElem = document.getElementById('page-num');

/* ZOOM FUNCTIONALITY */
const zoomSlider = document.getElementById('zoom');
zoomSlider.addEventListener('input', () => {
  pdfScale = zoomSlider.value;
  pdfViewer.style.setProperty('--scale-factor', pdfScale);
  updatePageNumber();
});

pdfViewer.addEventListener('wheel', evt => {
  const deltaMode = evt.deltaMode;
  let scaleFactor = Math.exp(-evt.deltaY / 100);

  if (evt.ctrlKey) {
    evt.preventDefault();
    zoom(scaleFactor, pdfViewer.scrollLeft + evt.clientX, pdfViewer.scrollTop + evt.clientY);
  }
  
  updatePageNumber();
}, {passive: false});

function zoom(scale, originX, originY) {
  pdfScale *= scale;
  if (pdfScale >= MIN_SCALE && pdfScale <= MAX_SCALE) {
    pdfViewer.style.setProperty('--scale-factor', pdfScale);
    pdfViewer.scrollTop -= originY * (1-scale);
  } else {
    pdfScale = clamp(pdfScale, MIN_SCALE, MAX_SCALE);
  }
  zoomSlider.value = pdfScale;
}

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

function updatePageNumber() {
  pageNumElem.innerText = `[${getPageNumber()} / ${pdf.numPages}]`;
}

function getPageNumber() {
  let bestPage = 0;
  let bestPagePos = null;
  
  pages.childNodes.forEach((page, i) => {
    const rect = page.getClientRects()[0];
    const position = Math.abs(2 * rect.y + rect.height - pdfViewer.clientHeight);
    if (!bestPagePos || position < bestPagePos) {
      bestPage = i;
      bestPagePos = position;
    }
  });

  return bestPage + 1;
}

displayPDF('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf');

function displayPDF(url) {
  var loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(_pdf => {
    pdf = _pdf;
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      pdf.getPage(pageNumber).then(page => {
        // console.log('Page', pageNumber, 'loading');

        // Create HTML element
        const pageElem = document.createElement('div');
        pageElem.classList.add('page');
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 600;
        const textLayerElem = document.createElement('div');
        textLayerElem.classList.add('text-layer');
        pageElem.appendChild(canvas);
        pageElem.appendChild(textLayerElem);
        pages.appendChild(pageElem);
  
        const scale = 1;
        const viewport = page.getViewport({scale: scale});
        const outputScale = window.devicePixelRatio || 1;
  
        // Prepare canvas using PDF page dimensions
        const context = canvas.getContext('2d');
  
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `calc(var(--scale-factor) * ${Math.floor(viewport.width)}px`;
        canvas.style.height = `calc(var(--scale-factor) * ${Math.floor(viewport.height)}px`;
  
        const transform = outputScale !== 1
          ? [outputScale, 0, 0, outputScale, 0, 0]
          : null;
  
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          transform: transform,
          viewport: viewport
        };
        const renderTask = page.render(renderContext);
        // renderTask.promise.then(() => {
        //   console.log('Page', pageNumber, 'rendered');
        // });
        
        page.getTextContent().then(textContent => {
          textLayerElem.setAttribute('class', 'textLayer');
          const textLayer =  pdfjsLib.renderTextLayer({
            textContentSource: textContent,
            container: textLayerElem,
            viewport: viewport
          });
          textLayer._render();
        });
      });
    }
  }, function (reason) {
    // PDF loading error
    console.error(reason);
  });
}