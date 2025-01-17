// components/Layout/Layout.jsx
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  const isHome = router.pathname === '/';

  return (
    <Box display="flex">
      {!isHome && <Sidebar />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;