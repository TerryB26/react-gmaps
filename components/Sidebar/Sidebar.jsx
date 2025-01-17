import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, AppBar, Toolbar } from '@mui/material';
import { MdMenu, MdHome, MdSettings, MdInfo } from 'react-icons/md';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(128, 0, 128)', 
    },
  },
});

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex">
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{ 
            width: 240, 
            flexShrink: 0, 
            '& .MuiDrawer-paper': { 
              width: 240, 
              backgroundColor: 'rgba(128, 0, 128, 0.05)', 
              borderRight: '1px solid rgba(128, 0, 128, 0.25)',
              boxShadow: '2px 0px 8px -3px rgba(128, 0, 128, 0.4)',
            } 
          }}
        >
          <Box p={2} textAlign="center" mt={0}>
            <img src="/images/Earth.png" alt="System Logo" style={{ width: '80%' }} />
          </Box>
          <List sx={{ mt: 0 }}>
            {[
              { text: 'Home', icon: <MdHome color="rgb(128, 0, 128)" />, path: '/' },

            ].map((item, index) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  border: '1px solid rgba(128, 0, 128, 0.25)',
                  borderRight: 'none', 
                  borderRadius: '15px 0 0 15px', 
                  mx: 0, 
                  mb: 1,
                  marginLeft: '20px',
                  boxShadow: '-2px 0px 8px -3px rgba(128, 0, 128, 0.4)', 
                  paddingRight: 2,
                  cursor: 'pointer', 
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Sidebar;