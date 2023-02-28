import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Dimensions} from 'react-native';
import {useState, useEffect, useContext} from 'react';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {AntDesign} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AspectRatio,
  Box,
  Image,
  Stack,
  Heading,
  Text,
  HStack,
  Pressable,
} from 'native-base';

const ListItem = ({singleMedia, navigation}) => {
  const [owner, setOwner] = useState({});
  const {user} = useContext(MainContext);
  const {getUserById} = useUser();
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();
  const item = singleMedia;
  const {user_id: userId, file_id: fileId} = singleMedia;
  const width = Dimensions.get('window').width;

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const owner = await getUserById(userId, token);
    // console.log('getOwner', owner);
    setOwner(owner);
  };

  const getLikes = async () => {
    const likes = await getFavouritesByFileId(fileId);
    // console.log('likes', likes, 'user', user);
    setLikes(likes);
    // check if the current user id is included in the 'likes' array and
    // set the 'userLikesIt' state accordingly
    for (const like of likes) {
      if (like.userId === user.userId) {
        setUserLikesIt(true);
        break;
      } else {
        setUserLikesIt(false);
        break;
      }
    }
  };

  const likeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await postFavourite(fileId, token);
      setUserLikesIt(true);
      getLikes();
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log(error);
    }
  };
  const dislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteFavourite(fileId, token);
      setUserLikesIt(false);
      getLikes();
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log(error);
    }
  };

  useEffect(() => {
    getOwner();
    getLikes();
  }, []);

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
          borderColor="#FFC56D"
          borderWidth="4"
          _dark={{
            borderColor: 'coolGray.600',
            backgroundColor: 'gray.700',
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: 'gray.50',
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
          <Stack p="4" space={0} overflow="hidden">
            <Stack alignItems="center">
              <Heading size="md" fontFamily="JudsonRegular">
                {item.title}
              </Heading>
            </Stack>
            <HStack alignItems="center" justifyContent="space-between">
              <Text
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="400"
                fontFamily="JudsonItalic"
              >
                {owner.username}
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
        </Box>
      </Box>
    </Pressable>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
