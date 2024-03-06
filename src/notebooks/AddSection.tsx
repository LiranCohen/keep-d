import { Fab, Box, TextField, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import TextIcon from '@mui/icons-material/Segment';
import JsonIcon from '@mui/icons-material/DataObject';
import ImageIcon from '@mui/icons-material/Image';

import { useContext, useMemo, useState } from 'react';
import { NotebooksContext } from '../context/NotebooksContext';
import { PendingContext } from '../compontents/dashboard/AddButton';
import Dropdown from '../compontents/dropdown/Dropdown';

const AddSection: React.FC<{
  done?: () => void
}> = ({ done }) => {
  const { api } = useContext(NotebooksContext);

  const [ title, setTitle ] = useState<string>('');
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
    return !api || !page|| pending;
  }, [ api, page, pending ]);

  const addSection = async () => {
    if (api && page && notebook) {
      setPending(true);
      await api.addSection(notebook, page, title);
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
      mt: 'auto'
    }}>
      <Typography sx={{ pb: 2, mb: 2, borderBottom: 1, borderColor: 'divider' }} variant='h6' component='h6'>Add a new Section</Typography>
      <TextField
        color='secondary'
        focused
        fullWidth
        required
        variant="outlined"
        label="Title"
        placeholder="Notebook Title..."
        value={title}
        sx={{ mb: 3 }}
        onChange={e => setTitle(e.target.value)}
        InputProps={{
          style: {
            color: 'white',
          },
        }}
        size="small"
      />
      <Dropdown items={contentTypes} handler={selectType} currentItem={selectedType} />
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Fab size='small' disabled={disabledAdd} color='secondary' sx={{ position: 'relative' }} onClick={addSection}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  )
};

export default AddSection;