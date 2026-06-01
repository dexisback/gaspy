import mammoth from "mammoth";

export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    // `pdf-parse` is a Node-only CJS package. Import it dynamically at runtime
    // so bundlers don't try to include it in client bundles.
    const mod: any = await import("pdf-parse").catch((e) => {
      throw new Error("Failed to load pdf-parse: " + String(e));
    });
    const pdf = mod.default ?? mod;
    const result = await pdf(buffer as any);
    return result.text as string;
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer,
    });

    return result.value;
  }

  throw new Error("Unsupported file type");
}


