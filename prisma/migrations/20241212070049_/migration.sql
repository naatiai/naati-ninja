-- AlterTable
ALTER TABLE "mock_questions" ADD COLUMN     "answer_time" INTEGER NOT NULL DEFAULT 15;

-- AlterTable
ALTER TABLE "mocks" ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'Medium';
