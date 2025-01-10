/*
  Warnings:

  - You are about to alter the column `totalRevenue` on the `MonthlyMetric` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - A unique constraint covering the columns `[email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `MonthlyMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MonthlyMetric" ADD COLUMN     "activeInventory" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCustomers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalVehicleCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalVehicles" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "totalAppointments" SET DEFAULT 0,
ALTER COLUMN "websiteAppointments" SET DEFAULT 0,
ALTER COLUMN "otherAppointments" SET DEFAULT 0,
ALTER COLUMN "totalVehiclesSold" SET DEFAULT 0,
ALTER COLUMN "websiteDriveSales" SET DEFAULT 0,
ALTER COLUMN "otherSourceSales" SET DEFAULT 0,
ALTER COLUMN "totalRevenue" SET DEFAULT 0,
ALTER COLUMN "totalRevenue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cancelledAppointments" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
