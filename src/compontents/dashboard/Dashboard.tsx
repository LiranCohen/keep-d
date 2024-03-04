import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { NotebooksStore } from '../../stores/notebooks/notebooks';
import { Identity } from '../../context/Web5Context';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import { Notebook } from '../../stores/notebooks/notebook';

const drawerWidth = 400;

const Dashboard: React.FC<{ title: string, identity: Identity }> = ({ title, identity }) => {
  const [ store, setStore ] = useState<NotebooksStore>();
  const [ current, setCurrent ] = useState<Notebook>();

  useEffect(() => {
    const loadStore = async (identity: Identity) => {
      const store = await NotebooksStore.load(identity);
      setStore(store);
    }

    if (!store && identity) {
      loadStore(identity);
    }

  }, [ identity, store ]);

  const profile = useMemo(() => {
    return identity.profile;
  }, [ identity ]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Header title={title} profile={profile} />
      <Sidebar drawerWidth={drawerWidth} selectNotebook={setCurrent} />
      <Content drawerWidth={drawerWidth} notebook={current} />
    </Box>
  );
};

export default Dashboard;