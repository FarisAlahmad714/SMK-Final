-- AlterTable
ALTER TABLE "VehicleSubmission" ADD COLUMN     "desiredVehicleId" TEXT;

-- AddForeignKey
ALTER TABLE "VehicleSubmission" ADD CONSTRAINT "VehicleSubmission_desiredVehicleId_fkey" FOREIGN KEY ("desiredVehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
