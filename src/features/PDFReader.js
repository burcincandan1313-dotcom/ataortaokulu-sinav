let pdfjsLib = null;

async function loadPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  try {
    pdfjsLib = await import('pdfjs-dist/build/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
    return pdfjsLib;
  } catch (e1) {
    try {
      pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
      return pdfjsLib;
    } catch (e2) {
      console.error('pdfjs-dist yüklenemedi:', e2);
      throw new Error('PDF kütüphanesi yüklenemedi. Lütfen "npm install" komutunu çalıştırın.');
    }
  }
}

export async function extractTextFromPDF(file) {
  try {
    const pdfjs = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    const maxPages = Math.min(pdf.numPages, 10);

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(' ') + '\n';
    }
    return fullText;
  } catch (error) {
    console.error("PDF okuma hatası:", error);
    throw new Error('PDF okunamadı: ' + error.message);
  }
}
