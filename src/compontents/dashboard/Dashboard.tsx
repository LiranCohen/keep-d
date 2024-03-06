import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { Identity } from '../../context/Web5Context';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';

const drawerWidth = 400;
const contentDrawerWidth = 300;

const Dashboard: React.FC<{ title: string, identity: Identity }> = ({ title, identity }) => {

  const profile = useMemo(() => {
    return identity.profile;
  }, [ identity ]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Header title={title} profile={profile} />
      <Sidebar drawerWidth={drawerWidth} />
      <Content drawerWidth={contentDrawerWidth} />
    </Box>
  );
};

export default Dashboard;