-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mocks_available" INTEGER NOT NULL,
    "mocks_used" INTEGER NOT NULL,
    "expires_on" TIMESTAMP(6),
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mocks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time_duration" INTEGER NOT NULL,
    "no_of_qa" INTEGER NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'Hindi',
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_questions" (
    "id" TEXT NOT NULL,
    "mock_id" TEXT NOT NULL,
    "audio_file_url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "transcript" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'English',
    "answer_language" TEXT NOT NULL DEFAULT 'English',
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_mocks" (
    "id" TEXT NOT NULL,
    "mock_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "attempts_allowed" INTEGER NOT NULL DEFAULT 1,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER,
    "passed" BOOLEAN,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_mocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_answers" (
    "id" TEXT NOT NULL,
    "mock_question_id" TEXT NOT NULL,
    "user_mock_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "audio_file_url" TEXT NOT NULL,
    "transcript" TEXT,
    "score" INTEGER,
    "max_score" INTEGER DEFAULT 5,
    "is_correct" BOOLEAN,
    "expires_on" TIMESTAMP(6),
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mock_id" TEXT,

    CONSTRAINT "mock_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscriptions_id_idx" ON "subscriptions"("id");

-- CreateIndex
CREATE INDEX "mocks_id_idx" ON "mocks"("id");

-- CreateIndex
CREATE INDEX "mock_questions_id_idx" ON "mock_questions"("id");

-- CreateIndex
CREATE INDEX "user_mocks_id_idx" ON "user_mocks"("id");

-- CreateIndex
CREATE INDEX "mock_answers_id_idx" ON "mock_answers"("id");

-- AddForeignKey
ALTER TABLE "mock_questions" ADD CONSTRAINT "mock_questions_mock_id_fkey" FOREIGN KEY ("mock_id") REFERENCES "mocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mocks" ADD CONSTRAINT "user_mocks_mock_id_fkey" FOREIGN KEY ("mock_id") REFERENCES "mocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_answers" ADD CONSTRAINT "mock_answers_user_mock_id_fkey" FOREIGN KEY ("user_mock_id") REFERENCES "user_mocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_answers" ADD CONSTRAINT "mock_answers_mock_question_id_fkey" FOREIGN KEY ("mock_question_id") REFERENCES "mock_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_answers" ADD CONSTRAINT "mock_answers_mock_id_fkey" FOREIGN KEY ("mock_id") REFERENCES "mocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
