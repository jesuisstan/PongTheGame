import { Outlet } from 'react-router-dom';
import Menu from './Menu';

const MainLayout = ({ user }: any) => {
  return (
    <div>
      <Menu user={user} />
      <Outlet />
    </div>
  );
};
export default MainLayout;
