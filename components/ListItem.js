import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Dimensions} from 'react-native';
import {useState, useEffect, useContext, useCallback} from 'react';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {AntDesign} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import {
  AspectRatio,
  Box,
  Image,
  Stack,
  Heading,
  Text,
  HStack,
  Pressable,
  PresenceTransition,
} from 'native-base';

const ListItem = ({singleMedia, navigation}) => {
  const {user_id: userId, file_id: fileId} = singleMedia;
  const [owner, setOwner] = useState({});
  const {user} = useContext(MainContext);
  const {getUserById} = useUser();
  const [userLikesIt, setUserLikesIt] = useState(false);
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();
  const item = singleMedia;
  const width = Dimensions.get('window').width;
  const [transition, setTransition] = useState(false);

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const owner = await getUserById(userId, token);
    // console.log('getOwner', owner);
    setOwner(owner);
  };

  const getLikes = async () => {
    const userLikes = await getFavouritesByFileId(fileId);
    // console.log('likes', userLikes, 'user', user);
    // check if the current user id is included in the 'likes' array and
    // set the 'userLikesIt' state accordingly
    for (const like of userLikes) {
      if (like.user_id === user.user_id) {
        setUserLikesIt(true);
        break;
      }
    }
  };

  const likeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await postFavourite(fileId, token);
      getLikes();
    } catch (error) {
      // note: you cannot like same file multiple times
    }
    setUserLikesIt(true);
  };
  const dislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteFavourite(fileId, token);
      getLikes();
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log(error);
    }
    setUserLikesIt(false);
  };

  useEffect(() => {
    getOwner();
    getLikes();
    setTransition(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getOwner();
      getLikes();
    }, [])
  );

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <Box alignItems="center">
        <Box
          width={width / 2}
          rounded="lg"
          overflow="hidden"
          borderColor="#fff"
          borderWidth="4"
          _light={{
            backgroundColor: 'gray.200',
          }}
        >
          <Box>
            <AspectRatio w="100%" ratio={1 / 1}>
              <Image
                source={{uri: uploadsUrl + item.thumbnails?.w160}}
                alt="image"
              />
            </AspectRatio>
          </Box>
          <PresenceTransition
            visible={transition}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 400,
              },
            }}
          >
            <Stack p="2" space={0} overflow="hidden">
              <Stack alignItems="center">
                <Heading size="md" fontFamily="JudsonRegular">
                  {item.title}
                </Heading>
              </Stack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text color="coolGray.600" fontFamily="JudsonItalic">
                  By: {owner.username}
                </Text>
                {userLikesIt ? (
                  <AntDesign
                    name="heart"
                    size={24}
                    color="red"
                    onPress={dislikeFile}
                  />
                ) : (
                  <AntDesign name="hearto" size={24} onPress={likeFile} />
                )}
              </HStack>
            </Stack>
          </PresenceTransition>
        </Box>
      </Box>
    </Pressable>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  children: PropTypes.object,
};

export default ListItem;
