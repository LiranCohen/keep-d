import { useMemo } from "react";
import { Profile } from "../../context/Web5Context";
import { Avatar } from '@mui/material';


const UserAvatar:React.FC<{ profile?: Profile }> = ({ profile }) => {

  const avatarProps = { bgcolor: 'secondary.main' };

  const src = useMemo(() => {
    if (profile?.avatar.dataFormat.startsWith('image/')) {
      return profile.avatar.uri;
    }
  }, [ profile ])

  return <Avatar sx={{...avatarProps}} src={src} />
}

export default UserAvatar;