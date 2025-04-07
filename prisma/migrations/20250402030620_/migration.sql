-- CreateEnum
CREATE TYPE "ReservationType" AS ENUM ('BORROW', 'RETURN');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ReservationType" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
