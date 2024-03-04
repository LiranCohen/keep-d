import React from 'react';
import { Toolbar, Drawer } from '@mui/material';
import NotebooksList from './NotebookList';
import AddNotebook from './AddNotebook';
import { Notebook } from '../../stores/notebooks/notebook';

const Sidebar: React.FC<{
  drawerWidth: number;
  selectNotebook: (notebook: Notebook) => void;
}> = ({ drawerWidth }) => {

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <NotebooksList />
      <AddNotebook />
    </Drawer>
  )
};

export default Sidebar;