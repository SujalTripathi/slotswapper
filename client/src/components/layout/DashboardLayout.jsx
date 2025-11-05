import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Container, Row, Col } from 'react-bootstrap';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <Container fluid className="flex-grow-1">
        <Row className="h-100">
          <Col md={3} lg={2} className="px-0">
            <Sidebar />
          </Col>
          <Col md={9} lg={10} className="py-4">
            {children}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default DashboardLayout;