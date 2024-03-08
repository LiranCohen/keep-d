import { Fab, Box, Typography, Paper } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import TextIcon from '@mui/icons-material/Segment';
import JsonIcon from '@mui/icons-material/DataObject';
import ImageIcon from '@mui/icons-material/Image';

import { useContext, useMemo, useState } from 'react';
import { NotebooksContext } from '../context/NotebooksContext';
import { PendingContext } from '../compontents/dashboard/AddButton';
import Dropdown from '../compontents/dropdown/Dropdown';
import MarkdownEditor from '../compontents/markdown/MarkdownEditor';


const AddSection: React.FC<{
  done?: () => void
}> = ({ done }) => {
  const { api } = useContext(NotebooksContext);

  const [ content, setContent ] = useState<string>('# Testing');
  const [ contentType, setContentType ] = useState<string>('');
  const { pending, setPending } = useContext(PendingContext);

  const contentTypes = useMemo(() => {
    return [{
      id: 'md',
      label: 'text/markdown',
      icon: <TextIcon />
    }, {
      id: 'plain',
      label: 'text/plain',
      icon: <TextIcon />
    },{
      id: 'json',
      label: 'application/json',
      icon: <JsonIcon />
    }, {
      id: 'jpeg',
      label: 'image/jpeg',
      icon: <ImageIcon />
    }, {
      id: 'png',
      label: 'image/png',
      icon: <ImageIcon />
    }];
  }, []);

  const selectedType = useMemo(() => {
    return contentTypes.find(type => type.id === contentType)
  }, [ contentType, contentTypes ]);
  const section = useMemo(() => {
    const { label: selectedContentType  } = selectedType || {};
    if (selectedContentType) {
      if (selectedContentType.startsWith('text/')) {
        return <Paper sx={{ minWidth: 550, margin: 10 }}>
          <MarkdownEditor content={content} setContent={setContent} />
        </Paper>;
      }

      if (selectedContentType.startsWith('application/')) {
        return <>Add App Data</>;
      }

      if (selectedContentType.startsWith('image/')) {
        return <>Add Image</>;
      }
    }

    return <> Select Content Type </>;
  }, [ selectedType, content ]);

  const selectType = (item: { id:string }) => {
    setContentType(item.id);
  }

  const notebook = useMemo(() => {
    return api?.currentNotebook;
  }, [ api?.currentNotebook ])

  const page = useMemo(() => {
    return api?.currentPage;
  }, [ api?.currentPage ]);

  const disabledAdd = useMemo(() => {
    return !contentType || !api || !page || pending;
  }, [ api, page, pending, contentType ]);

  const addSection = async () => {
    if (api && page && notebook && contentType && content) {
      setPending(true);
      await api.addSection(notebook, page, contentType, content);
      if (done) {
        done();
      }
      setPending(false);
    }
  }

  return (
    <Box component='form' autoComplete='off' noValidate sx={{
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      mt: 'auto',
    }}>
      <Box sx={{ display: 'flex', minHeight: 300, minWidth: 300, justifyContent: 'space-around', flexDirection: 'column', alignItems: 'center' }}>{section}</Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 250 }}>
        <Typography align='center' sx={{ pb: 2, mb: 2, borderBottom: 1, borderColor: 'divider', justifyContent: 'space-between' }} variant='h6' component='h6'>Add a new Section</Typography>
        <Dropdown items={contentTypes} handler={selectType} currentItem={selectedType} />
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Fab size='small' disabled={disabledAdd} color='secondary' sx={{ position: 'relative' }} onClick={addSection}>
            <AddIcon />
          </Fab>
        </Box>
      </Box>
    </Box>
  )
};

export default AddSection;