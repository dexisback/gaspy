import { gemini } from "@/lib/gemini";
import mammoth from "mammoth";
import * as xlsx from "xlsx";

async function extractPdfText(buffer: Buffer): Promise<string> {
  const base64 = buffer.toString("base64");

  const result = await gemini.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      {
        text: "Extract all the readable text from this PDF document. Return only the text content, preserving paragraph structure where possible.",
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
    ],
  });

  const text = result.text;
  if (!text) {
    throw new Error("Gemini returned no text for this PDF");
  }

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
