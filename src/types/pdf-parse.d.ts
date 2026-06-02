declare module "pdf-parse" {
  interface PDFParseResult {
    text: string;
    numpages: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown> | null;
    version: string;
  }

  function pdfParse(dataBuffer: Buffer): Promise<PDFParseResult>;

  export default pdfParse;
}
