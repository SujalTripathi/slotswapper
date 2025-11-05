import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-light h-100 min-vh-100 p-3">
      <div className="mb-4">
        <h2 className="fs-4 fw-semibold text-dark">
          Welcome, {user?.name || 'User'}
        </h2>
      </div>
      <Nav className="flex-column">
        <Nav.Link
          as={Link}
          to="/dashboard"
          className="text-dark"
        >
          My Events
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/dashboard/create-event"
          className="text-dark"
        >
          Create Event
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/dashboard/available-shifts"
          className="text-dark"
        >
          Available Shifts
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;