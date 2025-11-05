import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import swapService from '../../services/swapService';
import { formatDate } from '../../utils/dateUtils';

const SwapRequestModal = ({ isOpen, onClose, targetSlot, onRequestSent }) => {
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // reset state every time the modal opens
      setError(null);
      setSelectedSlotId(null);
      fetchMySwappableSlots();
    }
  }, [isOpen]);

  const fetchMySwappableSlots = async () => {
    setLoading(true);
    try {
      const data = await eventService.getUserEvents();
      setMySlots(data.filter(event => event.status === 'SWAPPABLE'));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch your swappable slots');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = async () => {
    if (!selectedSlotId) {
      setError('Please select a slot to swap');
      return;
    }

    // Basic validation
    const selectedSlot = mySlots.find(slot => (slot._id || slot.id) === selectedSlotId);
    if (!selectedSlot) {
      setError('Selected slot not found');
      return;
    }
    if (selectedSlot.status !== 'SWAPPABLE') {
      setError('Selected slot must be marked as swappable');
      return;
    }

    try {
      await swapService.createSwapRequest(selectedSlotId, targetSlot._id || targetSlot.id);
      onRequestSent?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create swap request');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <span className="material-icons">close</span>
        </button>

        <h2 className="text-2xl font-bold mb-4">Request Slot Swap</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Target Slot:</h3>
          <div className="p-4 bg-gray-50 rounded">
            <p className="font-medium">{targetSlot.title}</p>
            <p className="text-gray-600">{formatDate(targetSlot.startTime)} - {formatDate(targetSlot.endTime)}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading your swappable slots...</div>
        ) : error ? (
          <div className="text-red-600 py-4">{error}</div>
        ) : mySlots.length === 0 ? (
          <div className="text-gray-600 py-4">
            You don't have any swappable slots. Mark some of your slots as swappable first.
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">Choose your slot to offer:</h3>
            <div className="max-h-60 overflow-y-auto">
              {mySlots.map(slot => (
                <div
                  key={slot._id || slot.id}
                  onClick={() => setSelectedSlotId(slot._id || slot.id)}
                  className={`p-4 rounded mb-2 cursor-pointer border ${
                    selectedSlotId === (slot._id || slot.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="font-medium">{slot.title}</p>
                  <p className="text-gray-600">{formatDate(slot.startTime)} - {formatDate(slot.endTime)}</p>
                </div>
              ))}
            </div>
            {error && (
              <div className="text-red-600 py-2">{error}</div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRequestSwap}
            disabled={!selectedSlotId || loading}
            className={`px-4 py-2 rounded text-white ${
              selectedSlotId && !loading
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Request Swap
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestModal;