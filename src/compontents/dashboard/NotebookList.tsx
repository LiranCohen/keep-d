
import { List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, IconButton, ListItemSecondaryAction } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useContext, useMemo } from 'react';
import { NotebooksContext } from '../../context/NotebooksContext';

type Props = {}

const NotebooksList:React.FC<Props> = () => {

  const { api } = useContext(NotebooksContext);
  const notebooks = useMemo(() => {
    return api?.notebooks || [];
  }, [ api?.notebooks ]);

  return (
    <Box sx={{ overflow: 'auto' }}>
    <List>
      {notebooks.map((notebook) => <ListItemButton
        key={notebook.id}
        onClick={() => api?.selectNotebook(notebook.id)}
       >
        <ListItemIcon>
          <LibraryBooksIcon />
        </ListItemIcon>
        <ListItemText primary={notebook.title} secondary={notebook.description || new Date(notebook.created).toLocaleString()} />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={(event) => {
            event.stopPropagation();
            api?.remove(notebook.id);
          }}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemButton>)}
    </List>
    <Divider />
  </Box>
  )
};

export default NotebooksList;