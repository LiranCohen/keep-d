import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import UserAvatar from './UserAvatar';
import { Profile } from '../../context/Web5Context';

const Header: React.FC<{
  title: string;
  profile?: Profile;
}> = ({ title, profile }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <UserAvatar profile={profile} />
      </Toolbar>
    </AppBar>
  )
};

export default Header;