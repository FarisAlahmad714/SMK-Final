//Testdriveform.js
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { isSameDay, parseISO } from "date-fns";
import { useRouter } from "next/navigation"; // Import useRouter
import { trackTestDriveRequest } from "@/lib/firebase";

export default function TestDriveForm({ vehicle, onClose }) {
  const router = useRouter(); // Initialize router

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState([]);

  // Generate all time slots (9 AM to 7 PM)
  const allTimeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 9;
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  });

  // Fetch blocked times whenever date changes
  useEffect(() => {
    const fetchBlockedTimes = async () => {
      if (!formData.date) return;
      
      try {
        const date = new Date(formData.date);
        const res = await fetch(`/api/blocked-times?date=${date.toISOString()}`);
        if (!res.ok) throw new Error('Failed to fetch blocked times');
        const data = await res.json();
        setBlockedTimes(data);
      } catch (error) {
        console.error('Error fetching blocked times:', error);
      }
    };

    fetchBlockedTimes();
  }, [formData.date]);

  // Filter available time slots based on blocked times
  const getAvailableTimeSlots = () => {
    if (!formData.date) return allTimeSlots;

    return allTimeSlots.filter(time => {
      // Check if time is blocked
      const isBlocked = blockedTimes.some(block => 
        isSameDay(parseISO(block.date), new Date(formData.date)) &&
        time >= block.startTime &&
        time <= block.endTime
      );
      return !isBlocked;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
  
    // Convert 12-hour time back to 24-hour format for server
    const convert12to24 = (time12h) => {
      const [time, modifier] = time12h.split(' ');
      let [hours] = time.split(':');
      hours = parseInt(hours);
  
      if (hours === 12) {
        hours = modifier === 'PM' ? 12 : 0;
      } else {
        hours = modifier === 'PM' ? hours + 12 : hours;
      }
  
      return `${hours.toString().padStart(2, '0')}:00`;
    };
  
    // Convert local date to UTC while preserving the intended day
    const localDate = new Date(formData.date + "T" + convert12to24(formData.time));
    const utcDate = new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes()
      )
    );
  
    // Prepare data to send
    const data = {
      ...formData,
      time: convert12to24(formData.time), // Convert time back to 24-hour format
      source: "WEBSITE", 
      vehicleId: vehicle.id, 
      date: utcDate.toISOString(),
    };
  
    try {
      const res = await fetch("/api/test-drives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to schedule test drive");
      }
  
      setSuccess(true);
      
      // Track test drive request in Firebase/GA4
      trackTestDriveRequest(vehicle.id, "WEBSITE");
  
      // Redirect to home after a brief delay (e.g., 3 seconds)
      setTimeout(() => {
        router.push("/");
      }, 3000); // 3000 milliseconds = 3 seconds
  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  if (success) {
    return (
      <div className="text-center p-6">
        <h3 className="text-xl font-bold text-green-600 mb-2">
          Test Drive Scheduled!
        </h3>
        <p className="text-gray-600 mb-4">
          We&apos;ll be in touch shortly to confirm your appointment.
        </p>
        <p className="text-gray-500 mb-4">
          Redirecting to home page in 3 seconds...
        </p>
        <button 
          onClick={() => router.push("/")} // Immediate redirection on button click
          className="text-blue-600 hover:text-blue-800"
        >
          Go to Home Now
        </button>
      </div>
    );
  }

  const availableTimeSlots = getAvailableTimeSlots();
  const isDateFullyBlocked = formData.date && availableTimeSlots.length === 0;

  return (
    <div className="relative">
      <button onClick={onClose} className="absolute right-0 top-0 p-2">
        <X className="w-6 h-6" />
      </button>

      <h2 className="text-xl font-bold mb-4">Schedule Test Drive</h2>
      <p className="text-gray-600 mb-6">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            value={formData.customerName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customerName: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              value={formData.date}
              onChange={(e) => {
                setFormData((prev) => ({ 
                  ...prev, 
                  date: e.target.value,
                  time: "" // Reset time when date changes
                }));
              }}
            />
            {isDateFullyBlocked && (
              <p className="mt-1 text-sm text-red-600">
                This date is not available
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time
            </label>
            <select
              required
              className="w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              disabled={!formData.date || isDateFullyBlocked}
            >
              <option value="">Select time</option>
              {availableTimeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            rows="3"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={loading || isDateFullyBlocked}
        >
          {loading ? "Scheduling..." : "Schedule Test Drive"}
        </button>
      </form>
    </div>
  );
}
