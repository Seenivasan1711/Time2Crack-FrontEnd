import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import AIChatBox from '../AIChatBox';
import { useAppSelector } from '../../hooks/useAppSelector';

const MainLayout = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={window.location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex-grow container mx-auto px-4 py-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      
      <Footer />
      
      {(isAuthenticated || true) && <AIChatBox />}
    </div>
  );
};

export default MainLayout;