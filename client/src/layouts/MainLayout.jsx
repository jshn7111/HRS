import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppEmergencyButton from '../components/support/WhatsAppEmergencyButton';
import SupportChatWidget from '../components/support/SupportChatWidget';

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />

      <WhatsAppEmergencyButton />
      <SupportChatWidget />
    </>
  );
}

export default MainLayout;

