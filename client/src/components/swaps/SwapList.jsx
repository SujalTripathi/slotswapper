import React, { useState, useEffect } from 'react';
import swapService from '../../services/swapService';
import SwapRequestCard from './SwapRequestCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const SwapList = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    try {
      const data = await swapService.getMySwapRequests();
      setSwaps(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch swaps');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await swapService.respondToSwap(requestId, true);
      fetchSwaps();
    } catch (err) {
      setError(err.message || 'Failed to accept swap');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await swapService.respondToSwap(requestId, false);
      fetchSwaps();
    } catch (err) {
      setError(err.message || 'Failed to reject swap');
    }
  };

  const handleCancel = async (requestId) => {
    try {
      // Add cancelSwapRequest method to swapService if needed
      await swapService.respondToSwap(requestId, false);
      fetchSwaps();
    } catch (err) {
      setError(err.message || 'Failed to cancel swap');
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!swaps.length) return <p className="text-gray-500">No swap requests found.</p>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {swaps.map(swap => (
        <SwapRequestCard
          key={swap.id}
          swap={swap}
          onAccept={handleAccept}
          onReject={handleReject}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
};

export default SwapList;