import { Outlet } from 'react-router-dom';
import MenuBar from './MenuBar';

const MainLayout = ({ user }: any) => {
  return (
    <div>
      <MenuBar user={user} />
      <Outlet />
    </div>
  );
};
export default MainLayout;
