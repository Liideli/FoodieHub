import React, {useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import {useTag} from '../hooks/ApiHooks';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';

// NativeBase Components
import {Avatar, Box, Text} from 'native-base';

const AvatarName = (props) => {
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState('');
  const {user} = useContext(MainContext);
  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      flexWrap="wrap"
      margin={2}
    >
      <Avatar
        size="xl"
        borderWidth={1}
        borderColor={'black'}
        source={{uri: uploadsUrl + avatar}}
        alt="User avatar"
      />
      <Text fontSize="xl" marginLeft={2}>
        {user.username}
      </Text>
    </Box>
  );
};

export default AvatarName;
