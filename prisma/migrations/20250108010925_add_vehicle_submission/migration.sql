-- CreateTable
CREATE TABLE "VehicleSubmission" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "vehicleDetails" JSONB NOT NULL,
    "condition" JSONB NOT NULL,
    "ownership" TEXT NOT NULL,
    "photoUrls" TEXT[],
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleSubmission_pkey" PRIMARY KEY ("id")
);
