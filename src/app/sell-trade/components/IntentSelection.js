// src/app/sell-trade/components/IntentSelection.js

export default function IntentSelection({ formData, setFormData, onNext }) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          What would you like to do with your vehicle?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setFormData({ ...formData, intent: 'sell' });
              onNext();
            }}
            className="p-6 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <h3 className="text-xl font-semibold mb-2">Sell My Vehicle</h3>
            <p className="text-gray-600">
              Get a quick offer for your vehicle with no obligation to accept
            </p>
          </button>
          <button
            onClick={() => {
              setFormData({ ...formData, intent: 'trade' });
              onNext();
            }}
            className="p-6 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <h3 className="text-xl font-semibold mb-2">Trade My Vehicle</h3>
            <p className="text-gray-600">
              Trade in your current vehicle and upgrade to something new
            </p>
          </button>
        </div>
      </div>
    );
  }