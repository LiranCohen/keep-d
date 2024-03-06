import { useMemo } from "react";
import { Profile } from "../../context/Web5Context";
import { Avatar } from '@mui/material';


const UserAvatar:React.FC<{ profile?: Profile }> = ({ profile }) => {

  const avatarProps = { bgcolor: 'secondary.main' };
  const avatar = useMemo(() => {
    return profile?.avatar;
  }, [ profile ])

  const src = useMemo(() => {
    if (avatar?.dataFormat.startsWith('image/')) {
      return avatar.uri;
    }
  }, [ avatar ])

  return <Avatar sx={{...avatarProps}} src={src} />
}

export default UserAvatar;