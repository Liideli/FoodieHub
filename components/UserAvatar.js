import React, {useEffect} from 'react';
import {uploadsUrl} from '../utils/variables';
import {useTag, useUser} from '../hooks/ApiHooks';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// NativeBase Components
import {Avatar, Box, Text} from 'native-base';

// Custom component that includes the user avatar and username
// Used in profile page and drawer menu
const AvatarName = (props) => {
  const {getFilesByTag} = useTag();
  const {user} = useContext(MainContext);
  const {getUserByToken} = useUser();

  // Function for loading the user avatar
  const loadAvatar = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await getUserByToken(token);
    try {
      const avatarArray = await getFilesByTag(
        'foodiehubavatar' + userData.user_id
      );
      const avatar = avatarArray.pop().filename;
      user.avatar = avatar;
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  // Load the useravatar when the app starts
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
        source={{uri: uploadsUrl + user.avatar}}
        alt="User avatar"
      />
      <Text fontSize="xl" marginLeft={2}>
        {user.username}
      </Text>
    </Box>
  );
};

export default AvatarName;
