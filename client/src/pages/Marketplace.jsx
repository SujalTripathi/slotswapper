import React, { useState, useEffect } from 'react';
import swapService from '../services/swapService';
import EventCard from '../components/events/EventCard';
import SwapRequestModal from '../components/swaps/SwapRequestModal';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Marketplace = () => {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSwappableSlots();
  }, []);

  const fetchSwappableSlots = async () => {
    try {
      const data = await swapService.getSwappableSlots();
      setSwappableSlots(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch swappable slots');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleRequestSent = () => {
    fetchSwappableSlots(); // Refresh the list
  };

  if (loading) return (
    <div className="container py-5">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container py-5">
      <ErrorMessage message={error} />
    </div>
  );

  return (
    <div className="container-fluid py-4" style={{backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 56px)'}}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <div className="card-body p-4 p-md-5 text-white">
                <h1 className="display-5 display-md-4 fw-bold mb-3">
                  <i className="material-icons align-middle me-3" style={{fontSize: '48px'}}>store</i>
                  Event Marketplace
                </h1>
                <p className="lead mb-0">
                  Discover and swap time slots with other users. Find the perfect slot that fits your schedule!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Swappable Slots Grid */}
        {swappableSlots.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm border-0 text-center py-5">
                <div className="card-body">
                  <i className="material-icons text-muted mb-3" style={{fontSize: '72px'}}>inbox</i>
                  <h4 className="text-muted">No Swappable Slots Available</h4>
                  <p className="text-muted mb-0">Check back later for new opportunities!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {swappableSlots.map(slot => (
              <div key={slot._id || slot.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 hover-lift">
                  <div className="card-body">
                    <EventCard event={slot} />
                  </div>
                  <div className="card-footer bg-white border-0 pt-0 pb-3 px-3">
                    <button
                      onClick={() => handleRequestSwap(slot)}
                      className="btn btn-success w-100"
                    >
                      <i className="material-icons align-middle me-2" style={{fontSize: '20px'}}>swap_calls</i>
                      Request Swap
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swap Request Modal */}
      <SwapRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetSlot={selectedSlot}
        onRequestSent={handleRequestSent}
      />
    </div>
  );
};

export default Marketplace;