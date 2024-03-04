import React, { useContext, useMemo } from 'react';
import { Typography, Box, Breadcrumbs, Link, Stack, Pagination, Container, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Web5Context } from '../../context/Web5Context';
import { Page, PageStore } from '../../stores/notebooks/page';
import { Section } from '../../stores/notebooks/section';
import { NotebooksContext } from '../../context/NotebooksContext';

const section = 'Section';

const Content: React.FC<{ drawerWidth: number }> = ({ drawerWidth }) => {
  const { api } = useContext(NotebooksContext);

  const notebook = useMemo(() => {
    return api?.currentNotebook;
  }, [ api?.currentNotebook ])

  const pages = useMemo(() => {
    return api?.pages || [];
  }, [ api ]);

  const currentPage = useMemo(() => {
    return api?.currentPage;
  }, [ api ])

  const addPage = async () => {
    if (api && notebook) {
      // await api.addPage(notebook);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        mt: 8, // Adjust based on AppBar height to ensure content doesn't start under the AppBar
        display: 'flex',
        flexDirection: 'column'
      }}
    >
        <Breadcrumbs separator={<NavigateNextIcon fontSize="medium" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/">
            Notebooks
          </Link>
          {notebook && <Typography color="text.primary">{notebook.title}</Typography>}
          {section && <Typography color="text.primary">{section}</Typography>}
        </Breadcrumbs>

        <Container sx={{ flexGrow: 3 }}>
          {notebook && <>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
              {notebook.title}
            </Typography>
            {pages.length === 0 && <><Button onClick={() => addPage()}>Add Page</Button></>}
            {currentPage && <PageContent page={currentPage} />}
          </> || <Typography variant="h4" component="h4">Select A Notebook</Typography>}
        </Container>
        {/* Pagination Bar at the bottom */}
        <Stack spacing={2} sx={{ pt: 2 }}>
          <Pagination count={pages.length || 0} color="primary" />
        </Stack>
    </Box>
  );
};

const PageContent:React.FC<{ page: Page }> = ({ page }) => {
  const { api } = useContext(NotebooksContext);

  const sections = useMemo(() => {
    return [];
  }, [ ])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {page.id}
      { sections.length > 0 && sections.map(_ => 
      <Box>
        {/* {section.id} */}
      </Box>)}
      {/* <Button onClick={addSection}>Add Section</Button> */}
    </Box>
  );
}

export default Content;