import PDFParser from "pdf2json";
import mammoth from "mammoth";
import * as xlsx from "xlsx";

type PdfParserData = {
  Pages?: Array<{
    Texts?: Array<{
      R?: Array<{
        T?: string;
      }>;
    }>;
  }>;
};

async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(new Error(String(err)));
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const data = pdfParser.data as PdfParserData | undefined;
      let text = "";

      if (data && data.Pages) {
        for (const page of data.Pages) {
          if (page.Texts) {
            for (const textItem of page.Texts) {
              if (textItem.R) {
                for (const run of textItem.R) {
                  text += run.T || "";
                }
              }
              text += " ";
            }
          }
          text += "\n";
        }
      }

      resolve(text.trim());
      pdfParser.destroy();
    });

    pdfParser.parseBuffer(buffer);
  });
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
