import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SwapRequestCard from '../components/swaps/SwapRequestCard';
import swapService from '../services/swapService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const SwapRequests = () => {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const allRequests = await swapService.getMySwapRequests();
      
      // Separate incoming (I'm the target) and outgoing (I'm the requester)
      const incoming = allRequests.filter(req => 
        req.targetUser._id === user._id && req.status === 'PENDING'
      );
      const outgoing = allRequests.filter(req => 
        req.requestingUser._id === user._id && req.status === 'PENDING'
      );
      
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (err) {
      setError(err.message || 'Failed to fetch swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await swapService.respondToSwap(requestId, 'accept');
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to accept swap');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await swapService.respondToSwap(requestId, 'reject');
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to reject swap');
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container py-4" style={{backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 56px)'}}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-lg border-0" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '16px'
          }}>
            <div className="card-body p-4 p-md-5 text-white">
              <h1 className="mb-2 fw-bold">
                <i className="material-icons align-middle me-2" style={{fontSize: '36px'}}>swap_calls</i>
                Swap Requests
              </h1>
              <p className="mb-0 opacity-90" style={{fontSize: '1.1rem'}}>
                Manage incoming and outgoing swap requests
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Incoming Requests */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0" style={{borderRadius: '12px'}}>
            <div className="card-header py-3" style={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px'
            }}>
              <h4 className="mb-0 text-white fw-bold">
                <i className="material-icons align-middle me-2" style={{fontSize: '24px'}}>call_received</i>
                Incoming Requests
              </h4>
            </div>
            <div className="card-body p-4" style={{backgroundColor: '#fafafa', minHeight: '300px'}}>
              {incomingRequests.length === 0 ? (
                <div className="text-center py-5">
                  <i className="material-icons text-muted mb-3" style={{fontSize: '64px'}}>inbox</i>
                  <p className="text-muted mb-0">No incoming swap requests</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {incomingRequests.map(request => (
                    <SwapRequestCard
                      key={request._id}
                      swap={request}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      type="incoming"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Outgoing Requests */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0" style={{borderRadius: '12px'}}>
            <div className="card-header py-3" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px'
            }}>
              <h4 className="mb-0 text-white fw-bold">
                <i className="material-icons align-middle me-2" style={{fontSize: '24px'}}>call_made</i>
                Outgoing Requests
              </h4>
            </div>
            <div className="card-body p-4" style={{backgroundColor: '#fafafa', minHeight: '300px'}}>
              {outgoingRequests.length === 0 ? (
                <div className="text-center py-5">
                  <i className="material-icons text-muted mb-3" style={{fontSize: '64px'}}>outbox</i>
                  <p className="text-muted mb-0">No outgoing swap requests</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {outgoingRequests.map(request => (
                    <SwapRequestCard
                      key={request._id}
                      swap={request}
                      type="outgoing"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapRequests;