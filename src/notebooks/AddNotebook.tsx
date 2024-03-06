import { Fab, Box, TextField, Typography } from '@mui/material';
import { useContext, useMemo, useState } from 'react';
import { NotebooksContext } from '../context/NotebooksContext';
import AddIcon from '@mui/icons-material/Add';
import { PendingContext } from '../compontents/dashboard/AddButton';

const AddNotebook: React.FC<{
  done?: () => void
}> = ({ done }) => {
  const { api } = useContext(NotebooksContext);

  const [ title, setTitle ] = useState<string>('');
  const [ description, setDescription] = useState<string>('');
  const { pending, setPending } = useContext(PendingContext);

  const disabledAdd = useMemo(() => {
    return !api || !title || pending;
  }, [ api, title, pending ]);

  const addNotebook = async () => {
    if (api) {
      setPending(true);
      await api.create(title, description);
      setTitle('');
      setDescription('');
      setPending(false);
      if (done) {
        done()
      }
    }
  }

  return (
    <Box component='form' autoComplete='off' noValidate sx={{
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      mt: 'auto'
    }}>
      <Typography sx={{ pb: 2, mb: 2, borderBottom: 1, borderColor: 'divider' }} variant='h6' component='h6'>Add a new Notebook</Typography>
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
      <TextField
        color='secondary'
        variant="outlined"
        focused
        fullWidth
        multiline
        rows={3}
        label="Description"
        placeholder="Notebook Description..."
        sx={{ mb: 2 }}
        value={description}
        onChange={e => setDescription(e.target.value)}
        InputProps={{
          style: {
            color: 'white',
          },
        }}
        size="small"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Fab size='small' disabled={disabledAdd} color="secondary" sx={{ position: 'relative' }} onClick={addNotebook}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  )
};

export default AddNotebook;