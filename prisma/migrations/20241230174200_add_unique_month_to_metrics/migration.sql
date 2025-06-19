-- AlterTable
ALTER TABLE "TestDrive" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "reminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "soldDate" TIMESTAMP(3),
ADD COLUMN     "soldPrice" DECIMAL(65,30);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyMetric" (
    "id" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "totalAppointments" INTEGER NOT NULL,
    "websiteAppointments" INTEGER NOT NULL,
    "otherAppointments" INTEGER NOT NULL,
    "totalVehiclesSold" INTEGER NOT NULL,
    "websiteDriveSales" INTEGER NOT NULL,
    "otherSourceSales" INTEGER NOT NULL,
    "totalRevenue" DECIMAL(65,30) NOT NULL,
    "cancelledAppointments" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyMetric_month_key" ON "MonthlyMetric"("month");

-- AddForeignKey
ALTER TABLE "TestDrive" ADD CONSTRAINT "TestDrive_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
