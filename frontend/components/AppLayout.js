import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import CustomBreadcrumbs from './BreadCrumbs';

const AppLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
        }}
        className="app-main-content"
      >
        <div className="xs:mt-4 sm:mt-8 mb-5">
          <CustomBreadcrumbs />
        </div>
        {children}
      </Box>
    </Box>
  );
};
export default AppLayout;
