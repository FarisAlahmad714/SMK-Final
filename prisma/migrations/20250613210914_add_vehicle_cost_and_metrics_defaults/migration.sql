/*
  Warnings:

  - You are about to drop the column `reminderSent` on the `TestDrive` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MonthlyMetric" ADD COLUMN     "approvedSellTrade" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "monthlySellRequests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "monthlyTradeRequests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pendingSellTrade" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rejectedSellTrade" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSellRequests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalTradeRequests" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TestDrive" DROP COLUMN "reminderSent",
ADD COLUMN     "dayOfReminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nextDayReminderSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "cost" SET DEFAULT 0;
