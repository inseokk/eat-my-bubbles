// var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';

const { pdfjsLib } = globalThis;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

displayPDF('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf');

function displayPDF(url) {
  var loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(pdf => {
    console.log('PDF loaded', pdf, pdf.numPages);

    // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(page => {
      console.log('Page loaded');

      var scale = 1;
      var viewport = page.getViewport({scale: scale});
      var outputScale = window.devicePixelRatio || 1;

      // Prepare canvas using PDF page dimensions
      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height =  Math.floor(viewport.height) + "px";

      var transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : null;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);
      renderTask.promise.then(() => {
        console.log('Page rendered');
      });
      
      page.getTextContent().then(textContent => {
        const textLayerDiv = document.getElementById('textlayer');
        textLayerDiv.setAttribute('class', 'textLayer');
        var textLayer =  pdfjsLib.renderTextLayer({
          textContent: textContent,
          container: textLayerDiv,
          viewport: viewport
        });
        textLayer._render();
      });
    });
  }, function (reason) {
    // PDF loading error
    console.error(reason);
  });
}