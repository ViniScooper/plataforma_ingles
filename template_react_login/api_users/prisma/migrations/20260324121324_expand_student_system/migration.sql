-- AlterTable
ALTER TABLE "enrollment" ADD COLUMN     "classesPerWeek" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "lessonDescription" TEXT,
ADD COLUMN     "pricePerClass" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "studentLevel" TEXT NOT NULL DEFAULT 'Beginner';

-- AlterTable
ALTER TABLE "exercise" ADD COLUMN     "content" JSONB,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'New Exercise',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'gap-fill',
ALTER COLUMN "sentence" DROP NOT NULL,
ALTER COLUMN "gaps" DROP NOT NULL;

-- CreateTable
CREATE TABLE "student_exercise" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "result" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_exercise_userId_exerciseId_key" ON "student_exercise"("userId", "exerciseId");

-- AddForeignKey
ALTER TABLE "student_exercise" ADD CONSTRAINT "student_exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exercise" ADD CONSTRAINT "student_exercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
