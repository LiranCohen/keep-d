import React from 'react';
import { Toolbar, Drawer } from '@mui/material';
import NotebooksList from './NotebookList';

const Sidebar: React.FC<{
  drawerWidth: number;
}> = ({ drawerWidth }) => {

  return (
    <Drawer
      anchor='left'
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <NotebooksList />
    </Drawer>
  )
};

export default Sidebar;