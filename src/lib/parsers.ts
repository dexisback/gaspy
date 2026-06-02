import pdf from "pdf-parse-new";
import mammoth from "mammoth";
import * as xlsx from "xlsx";

export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const result = await pdf(buffer);
    return result.text;
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