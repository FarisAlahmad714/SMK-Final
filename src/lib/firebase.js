// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTg4mO3GhFcD8eIKvyWv_cectPwW9vo4k",
  authDomain: "dealer-crm-580e8.firebaseapp.com",
  projectId: "dealer-crm-580e8",
  storageBucket: "dealer-crm-580e8.firebasestorage.app",
  messagingSenderId: "1055413368947",
  appId: "1:1055413368947:web:7228d0399cfbee0e179206",
  measurementId: "G-P233XBCDTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics and Performance (only in browser)
let analytics = null;
let performance = null;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  performance = getPerformance(app);
}

export { app, analytics, performance };

// Custom event tracking functions for dealership
export const trackDealershipEvent = (eventName, parameters = {}) => {
  if (analytics) {
    import('firebase/analytics').then(({ logEvent }) => {
      logEvent(analytics, eventName, {
        dealership: 'SMK_Auto',
        timestamp: new Date().toISOString(),
        ...parameters
      });
    });
  }
};

// Specific dealership tracking functions
export const trackVehicleView = (vehicleId, make, model, year) => {
  trackDealershipEvent('vehicle_view', {
    vehicle_id: vehicleId,
    vehicle_make: make,
    vehicle_model: model,
    vehicle_year: year,
    content_type: 'vehicle'
  });
};

export const trackTestDriveRequest = (vehicleId, customerSource) => {
  trackDealershipEvent('test_drive_request', {
    vehicle_id: vehicleId,
    customer_source: customerSource,
    conversion_type: 'test_drive',
    value: 1
  });
};

export const trackSellTradeSubmission = (submissionType, vehicleYear, vehicleMake) => {
  trackDealershipEvent('sell_trade_submission', {
    submission_type: submissionType,
    vehicle_year: vehicleYear,
    vehicle_make: vehicleMake,
    content_type: 'lead'
  });
};

export const trackVehicleSale = (vehicleId, salePrice, profit) => {
  trackDealershipEvent('vehicle_sale', {
    vehicle_id: vehicleId,
    value: salePrice,
    profit: profit,
    currency: 'USD',
    conversion_type: 'sale'
  });
};

export const trackAdminAction = (action, module) => {
  trackDealershipEvent('admin_action', {
    action: action,
    module: module,
    user_type: 'admin'
  });
};

export const trackAIAssistantUsage = (query, responseTime) => {
  trackDealershipEvent('ai_assistant_usage', {
    query_type: 'dealership_data',
    response_time_ms: responseTime,
    feature: 'abood_ai'
  });
};