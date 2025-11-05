import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <h5 className="fw-bold mb-2">
              <i className="material-icons align-middle me-2" style={{fontSize: '24px'}}>swap_horiz</i>
              SlotSwapper
            </h5>
            <p className="mb-0 text-muted small">Peer-to-peer time-slot scheduling made easy</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-2 small">
              &copy; {new Date().getFullYear()} SlotSwapper. All rights reserved.
            </p>
            <p className="mb-0 small text-muted">
              Built for ServiceHive Internship Technical Challenge
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;