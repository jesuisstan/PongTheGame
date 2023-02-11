import { Outlet } from 'react-router-dom';
import MenuBar from './MenuBar';
import Footer from './Footer'

const MainLayout = () => {
  return (
    <div>
      <MenuBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
