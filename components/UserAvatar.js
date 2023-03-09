import React, {useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import {useTag, useUser} from '../hooks/ApiHooks';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// NativeBase Components
import {Avatar, Box, Text} from 'native-base';

const AvatarName = () => {
  const {getFilesByTag} = useTag();
  const {user} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const loadAvatar = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await getUserByToken(token);
    console.log('foodiehubavatar' + userData.user_id);
    try {
      const avatarArray = await getFilesByTag(
        'foodiehubavatar' + userData.user_id
      );
      console.log('teeees', avatarArray);
      const avatar = avatarArray.pop().filename;
      console.log('avat', avatar);
      user.avatar = avatar;
      console.log(user);
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
