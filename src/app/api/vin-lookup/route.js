// src/app/api/vin-lookup/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get('vin');

    if (!vin) {
      return NextResponse.json({ error: 'VIN is required' }, { status: 400 });
    }

    // Using a more reliable NHTSA endpoint
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from NHTSA');
    }

    const data = await response.json();
    
    if (!data.Results || !data.Results[0]) {
      throw new Error('No results found');
    }

    const result = data.Results[0];

    // Format the response with only the data we need
    const vehicleInfo = {
      year: result.ModelYear,
      make: result.Make,
      model: result.Model,
      trim: result.Trim,
      bodyStyle: result.BodyClass,
      driveType: result.DriveType,
      engineCylinders: result.EngineCylinders,
      engineSize: result.EngineSize,
      fuelType: result.FuelTypePrimary,
      manufacturer: result.Manufacturer
    };

    return NextResponse.json(vehicleInfo);
    
  } catch (error) {
    console.error('VIN lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to decode VIN' },
      { status: 500 }
    );
  }
}