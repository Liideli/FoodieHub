import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Dimensions} from 'react-native';
import {useState, useEffect, useContext, useCallback} from 'react';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {AntDesign} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import * as Haptics from 'expo-haptics';

// NativeBase Components
import {
  AspectRatio,
  Box,
  Image,
  Stack,
  Heading,
  Text,
  HStack,
  PresenceTransition,
  Center,
} from 'native-base';

const ListItem = ({singleMedia, navigation}) => {
  const {file_id: fileId} = singleMedia;
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
    const owner = await getUserById(item.user_id, token);
    setOwner(owner);
  };

  const getLikes = async () => {
    const likes = await getFavouritesByFileId(fileId);
    // check if the current user id is included in the 'likes' array and
    // set the 'userLikesIt' state accordingly
    for (const like of likes) {
      if (like.user_id === user.user_id) {
        setUserLikesIt(true);
        break;
      }
      if (like.user_id !== user.user_id) {
        setUserLikesIt(false);
        break;
      }
    }
    if (likes.length === 0) {
      setUserLikesIt(false);
    }
  };

  const likeFile = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const token = await AsyncStorage.getItem('userToken');
      await postFavourite(fileId, token);
      getLikes();
    } catch (error) {
      // You cannot like same file multiple times
    }
    setUserLikesIt(true);
  };
  const dislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteFavourite(fileId, token);
      getLikes();
    } catch (error) {
      // You cannot like same file multiple times
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
    <Box alignItems="center">
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
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('Single', item);
          }}
        >
          <Box
            width={width / 2}
            rounded="3xl"
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
            <Stack p="2" space={0} backgroundColor="#FFC56D">
              <Stack alignItems="center">
                <Heading size="sm" color="black">
                  {item.title}
                </Heading>
              </Stack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text color="coolGray.600" fontSize="sm">
                  By: {owner.username}
                </Text>
                <Center size={7}>
                  {userLikesIt ? (
                    <TouchableWithoutFeedback onPress={dislikeFile}>
                      <Box>
                        <AntDesign name="heart" size={28} color="red" />
                      </Box>
                    </TouchableWithoutFeedback>
                  ) : (
                    <TouchableWithoutFeedback onPress={likeFile}>
                      <Box>
                        <AntDesign name="hearto" size={24} color="black" />
                      </Box>
                    </TouchableWithoutFeedback>
                  )}
                </Center>
              </HStack>
            </Stack>
          </Box>
        </TouchableOpacity>
      </PresenceTransition>
    </Box>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  children: PropTypes.object,
};

export default ListItem;
