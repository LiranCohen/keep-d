import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Chip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}) as typeof Chip;

interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode;
}

const Dropdown:React.FC<{
  label?: string;
  handler: (item: DropdownItem) => void;
  currentItem?: DropdownItem;
  items: DropdownItem[];
  open?: boolean;
  setOpen?: (open: boolean) => void;
}> = ({ handler, currentItem, items, label, open, setOpen }) => {
  const [internalOpen, setInternalOpen] = useState(open || false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open);
    }
  }, [ open ]);

  const setOpenState = (open: boolean) => {
    if (setOpen) {
      return setOpen(open);
    }
    return setInternalOpen(open);
  }

  const activeRef = useMemo(() => {
    if (internalOpen) {
      return dropdownRef;
    }
  }, [internalOpen, dropdownRef])

  const handleClick = () => {
    setOpenState(!internalOpen);
  }
  const handleClose = () => {
    setOpenState(false);
  }

  return (
    <>
      <StyledBreadcrumb
        ref={dropdownRef} 
        label={currentItem?.label || label || 'Select Item'}
        onClick={handleClick}
        deleteIcon={<ExpandMoreIcon />}
        onDelete={handleClick}
      />
      <Menu
        id="simple-menu"
        keepMounted
        anchorEl={activeRef?.current}
        open={Boolean(activeRef)}
        onClose={handleClose}
      >
        {items.map((item) => (
          <MenuItem disabled={currentItem?.id === item.id} key={item.id} onClick={() => handler(item)}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default Dropdown;