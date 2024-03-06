import { Button, Box, TextField } from '@mui/material';
import { useContext, useMemo, useState } from 'react';
import { NotebooksContext } from '../../context/NotebooksContext';

const AddNotebook: React.FC<{
}> = () => {
  const { api } = useContext(NotebooksContext);

  const [ newNotebook, setNewNotebook ] = useState<string>('');
  const [ pending, setPending ] = useState(false);

  const addNotebookDisabled = useMemo(() => {
    return !api || !newNotebook || pending;
  }, [ api, newNotebook, pending ]);

  const addNotebook = async () => {
    if (api) {
      setPending(true);
      await api.create(newNotebook);
      setNewNotebook('');
      setPending(false);
    }
  }

  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Notebook Title..."
        value={newNotebook}
        onChange={e => setNewNotebook(e.target.value)}
        size="small"
      />
      <Button
        fullWidth
        disabled={addNotebookDisabled}
        variant="contained"
        color="primary"
        onClick={addNotebook}
        sx={{ mt: 1 }}
      >New Notebook</Button>
    </Box>
  )
};

export default AddNotebook;