-- AlterTable: Fix Chunk embedding dimension from 1536 to 3072
ALTER TABLE "Chunk" DROP COLUMN "embedding";
ALTER TABLE "Chunk" ADD COLUMN "embedding" vector(3072);

-- Clear existing QAPair embeddings since they may have wrong dimensions
UPDATE "QAPair" SET "questionEmbedding" = NULL;
