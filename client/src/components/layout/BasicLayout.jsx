import Navbar from './Navbar';
import Footer from './Footer';
import { Container } from 'react-bootstrap';

const BasicLayout = ({ children }) => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <Container className="flex-grow-1 py-4">
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default BasicLayout;