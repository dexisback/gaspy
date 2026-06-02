import mammoth from "mammoth";
import * as xlsx from "xlsx";

async function extractPdfText(buffer: Buffer): Promise<string> {
  // Lazy import to avoid loading pdfjs-dist unless a PDF is actually uploaded.
  // This prevents module initialization errors from crashing the whole API route.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    isEvalSupported: false,
    cMapUrl: "./",
    standardFontDataUrl: "./",
  }).promise;

  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = (content.items as any[]).map((item) => item.str || "");
    text += strings.join(" ") + "\n";
    page.cleanup();
  }

  await doc.destroy();
  return text.trim();
}

export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    try {
      return await extractPdfText(buffer);
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw new Error(
        "Failed to extract text from PDF. The file may be corrupted, scanned (image-based), or password-protected."
      );
    }
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel"
  ) {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_csv(firstSheet);
  }

  throw new Error("Unsupported file type");
}
