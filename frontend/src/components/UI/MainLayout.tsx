import { Outlet } from 'react-router-dom';
import MenuBar from './MenuBar';
import Footer from './Footer'

const MainLayout = ({ user }: any) => {
  return (
    <div>
      <MenuBar user={user} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
