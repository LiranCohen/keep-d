import React, { ReactElement, RefObject, createContext, useContext, useMemo, useRef, useState } from 'react';
import { 
  Box, Fab, Chip, Zoom
} from '@mui/material';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import NotebookIcon from '@mui/icons-material/LibraryBooks';
import PageIcon from '@mui/icons-material/Article';
import SectionIcon from '@mui/icons-material/Segment';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import AddNotebook from '../../notebooks/AddNotebook';
import { NotebooksContext } from '../../context/NotebooksContext';
import AddPage from '../../notebooks/AddPage';
import AddSection from '../../notebooks/AddSection';

export const PendingContext = createContext<{ pending: boolean, setPending: (pending: boolean) => void }>({ pending: false, setPending: () => {} });

const ActionButtonWithChips: React.FC = () => {
  const { api } = useContext(NotebooksContext);
  const [ open, setOpen ] = useState(false);
  const [ pending, setPending ] = useState(false);
  const [ checkIcon, setCheckIcon ] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ReactElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null);


  const color = useMemo(() => {
    return checkIcon ? 'success' : 'primary'
  }, [ checkIcon ]);

  const Icon = useMemo(() => {
    return checkIcon ? CheckIcon : AddIcon;
  }, [ checkIcon ]);

  const handleToggle = () => {
    setOpen(!open);

    if(open) setSelectedComponent(null);
  };
  
  const MenuComponent = useMemo(() => {
    return selectedComponent ? <BasePopup
      open={!!anchorEl}
      anchor={anchorEl}
      placement='top'
      onClose={() => setSelectedComponent(null)}
    ><Box sx={{ mb: 2 }}>{selectedComponent}</Box></BasePopup> : undefined;
  },[ selectedComponent, anchorEl]);

  type ChipOptions = {
    id: string;
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    icon?: ReactElement;
    ref: RefObject<HTMLDivElement>;
    handlerOptions: {
      handler?: () => void;
      component?: ReactElement;
    }
  };

  const reset = async () => {
    setCheckIcon(true);
    setAnchorEl(null);
    setSelectedComponent(null);
    setOpen(false);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCheckIcon(false);
  }

  const disabledAdd = useMemo(() => {
    return pending || !api;
  }, [ api, pending ]);

  const addNotebookRef = useRef<HTMLDivElement>(null);
  const addPageRef = useRef<HTMLDivElement>(null);
  const addSectionRef = useRef<HTMLDivElement>(null);

  const chips = useMemo(() => {
    const chips: ChipOptions[] = [{
      id: 'notebook',
      label: 'Add Notebook',
      color: 'secondary',
      icon: <NotebookIcon />,
      ref: addNotebookRef,
      handlerOptions: {
        component: <AddNotebook done={reset} /> 
      }
    },{
      id: 'page',
      label: 'Add Page',
      color: 'secondary',
      icon: <PageIcon />,
      ref: addPageRef,
      handlerOptions: {
        component: <AddPage done={reset} />
      }
    },{
      id: 'section',
      label: 'Add Section',
      color: 'secondary',
      icon: <SectionIcon />,
      ref: addSectionRef,
      handlerOptions: {
        component: <AddSection done={reset} />
      }
    }];

    return chips.filter(chip => {
      if (chip.id === 'page' && api?.currentNotebook === undefined) {
        return false;
      } else if (chip.id === 'section' && api?.currentPage === undefined) {
        return false;
      }
      return true;
    });
  }, [ api ]);



  const handler = (chip: ChipOptions) => {
    return () => {
      if (chip.handlerOptions.component) {
        if (anchorEl === chip.ref.current) {
          setAnchorEl(null);
          setSelectedComponent(null);
        } else {
          setAnchorEl(chip.ref.current);
          setSelectedComponent(chip.handlerOptions.component);
        }
      } else if (chip.handlerOptions.handler) {
        setAnchorEl(null);
        setSelectedComponent(null);
        chip.handlerOptions.handler();
      }
    }
  }

  return (
    <Box sx={{
      position: 'fixed',
      height: 75,
      bottom: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'row-reverse',
      pr: 10,
     }} >
      <PendingContext.Provider value={{ setPending, pending }} >
        {MenuComponent}
        {chips.map((chip, index) => 
          <Zoom key={chip.id} in={open} unmountOnExit style={index === 0 ? {} : { transitionDelay: open ? `${index * 50}ms` : '0ms' }}>
            <Chip
              ref={chip.ref}
              label={chip.label}
              color={chip.color}
              deleteIcon={chip.icon}
              disabled={pending}
              onDelete={chip.icon ? handler(chip) : undefined}
              onClick={handler(chip)}
              sx={{
                p: 1.5,
                mt: 2.6,
                ml: 1.5,
                zIndex: (theme) => theme.zIndex.drawer +1,
              }}
            ></Chip>
          </Zoom>
        )}
        <Fab disabled={disabledAdd} color={color} sx={{ position: 'absolute', right: 10, bottom: 10 }} onClick={handleToggle}>
          <Icon />
        </Fab>
      </PendingContext.Provider>
    </Box>
  );
};

export default ActionButtonWithChips;