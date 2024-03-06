import { Fab, Box, Typography } from '@mui/material';
import { useContext, useMemo } from 'react';
import { NotebooksContext } from '../context/NotebooksContext';
import AddIcon from '@mui/icons-material/Add';
import { PendingContext } from '../compontents/dashboard/AddButton';

const AddPage: React.FC<{
  done?: () => void
}> = ({ done }) => {
  const { api } = useContext(NotebooksContext);
  const { pending, setPending } = useContext(PendingContext);

  const notebook = useMemo(() => {
    return api?.currentNotebook;
  }, [ api?.currentNotebook ]);

  const disabledAdd = useMemo(() => {
    return !notebook || pending;
  }, [ notebook, pending ]);


  const addPage = async () => {
    if (api && notebook && !pending) {
      setPending(true);
      await api.addPage(notebook);
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
      <Typography sx={{ pb: 2, mb: 2, borderBottom: 1, borderColor: 'divider' }} variant='h6' component='h6'>Add a new Page</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Fab size='small' disabled={disabledAdd} color='secondary' sx={{ position: 'relative' }} onClick={addPage}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>

  )
};

export default AddPage;