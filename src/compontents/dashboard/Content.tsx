import React, { useContext, useMemo } from 'react';
import { 
  Typography,
  Box, Breadcrumbs, Link, Paper, Container,
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Page } from '../../stores/notebooks/page';
import { NotebooksContext } from '../../context/NotebooksContext';
import { Notebook } from '../../stores/notebooks/notebook';
import { Section } from '../../stores/notebooks/section';
import ActionButtonWithChips from './AddButton';
import Dropdown from '../dropdown/Dropdown';

const Content: React.FC<{ drawerWidth: number }> = ({ drawerWidth }) => {
  const { api } = useContext(NotebooksContext);

  const notebook = useMemo(() => {
    return api?.currentNotebook;
  }, [ api?.currentNotebook ]);

  const page = useMemo(() => {
    return api?.currentPage; 
  }, [ api?.currentPage ]);

  const pages = useMemo(() => {
    return api?.pages || [];
  }, [ api ]);

  const section = useMemo(() => {
    return api?.currentSection; 
  }, [ api?.currentSection ]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <BreadCrumbBar notebook={notebook} pages={pages} page={page} section={section} />
      {!notebook && <Container sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        <Paper sx={{ padding: 4, zIndex: (theme) => theme.zIndex.drawer }}>
          <Typography variant='h4' component='h4'>Select or Create</Typography>
          <Typography variant='h3' component='h3'>a Notebook</Typography>
        </Paper>
      </Container>}
      {notebook && <NotebookContent pageDrawerWidth={drawerWidth} />}
      <ActionButtonWithChips />
    </Box>
  );
};

const PageBar:React.FC<{ page: Page, index: number }> = ({ page, index }) => {

  const statusText = useMemo(() => {
    if (page.created < page.updated) {
      return new Date(page.updated).toLocaleString() + '(edited)';
    }
    return new Date(page.created).toLocaleString();
  }, [ page ]);

  const pageLabel = useMemo(() => {
    if (index > -1) {
      return `Page ${index + 1}`;
    }
  }, [ index ]);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
      <Typography fontSize="small" sx={{ color: '#bbb', fontStyle: 'italic', textAlign: 'left', ml: 2, mt: 1 }}>{pageLabel}</Typography>
      <Typography fontSize="small" sx={{ color: '#bbb', fontStyle: 'italic', textAlign: 'right', mr: 2, mt: 1, flexGrow: 1 }}>{statusText}</Typography>
    </Box>
  );
};

const NotebookContent:React.FC<{ pageDrawerWidth: number }> = () => {
  const { api } = useContext(NotebooksContext);

  const pages = useMemo(() => {
    return api?.pages || [];
  }, [ api ]);

  const sections = useMemo(() => {
    return api?.sections || [];
  }, [ api ]);

  const currentPage = useMemo(() => {
    return api?.currentPage;
  }, [ api ])

  return (
    <Box sx={{ maxWidth: 900, minWidth: 700, width: '100%', m: 'auto', mt: 0 }}>
      {currentPage && <PageBar page={currentPage} index={pages.indexOf(currentPage)} />}
      {sections.map(section => <Typography key={section.id}>{section.title || 'no title' }</Typography>)}
      {!currentPage && pages.length === 0 && <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', margin: 3 }}>
        <Typography>There are no pages, maybe you should add a new one.</Typography>
      </Box>}
    </Box>
  );
};

const BreadCrumbBar: React.FC<{
  notebook?: Notebook;
  page?: Page;
  pages?: Page[];
  section?: Section;
}> = ({ notebook, page, pages, section }) => {
  const { api } = useContext(NotebooksContext);
  const label = (page: number) => `Page ${page}`
  const currentPage = useMemo(() => {
    if (api?.currentPage) {
      const id = api.currentPage.id;
      const index = pages?.findIndex(page => page.id === id);
      if (index && index > -1) {
        return {
          id,
          label : label(index + 1) 
        }
      }
    }
  }, [ api?.currentPage, pages ])

  return(
    <Box sx={{
      pl: 2,
      zIndex: (theme) => theme.zIndex.drawer - 1,
      bgcolor: 'secondary.main',
      margin: 0,
      display: 'flex'
    }} >
      <Breadcrumbs separator={<NavigateNextIcon fontSize="medium" />} aria-label="breadcrumb" sx={{ mb: 2.5, mt: 2.5, color: 'white', flexGrow: 1 }}>
        <Link underline="hover" color="inherit" href="/">Notebooks</Link>
        {notebook && <Typography>{notebook.title}</Typography>}
        {notebook && page && pages && <Dropdown
          label='Select Page'
          items={pages.map((page, index) => ({ id: page.id, label: label(index + 1) }))}
          currentItem={currentPage}
          handler={(item) => api?.selectPage(notebook, item.id)}
        />}
        {section && <Typography>{section.title || 'no title'}</Typography>}
      </Breadcrumbs>
    </Box>
  );
};

export default Content;