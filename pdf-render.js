// var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';

const { pdfjsLib } = globalThis;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

var pdf;
const pages = document.getElementById('pages');

/* ZOOM FUNCTIONALITY */
const zoomSlider = document.getElementById('zoom');
zoomSlider.addEventListener('input', () => {
  pages.style.setProperty('--scale-factor', zoomSlider.value);
});

window.addEventListener('wheel', evt => {
  const deltaMode = evt.deltaMode;
  let scaleFactor = Math.exp(-evt.deltaY / 100);

  // evt.clientX, evt.clientY

  if (evt.ctrlKey) {
    evt.preventDefault();
    
    zoomSlider.value = clamp(zoomSlider.value * scaleFactor, 0.1, 2);
    pages.style.setProperty('--scale-factor', zoomSlider.value);
  }
}, {passive: false});

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
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