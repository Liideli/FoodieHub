import React, {useContext, useEffect, useRef, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {useFavourite, useUser, useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AspectRatio, Box, Center, Fab, HStack, Image, Modal, ScrollView, Stack, Text, useToast } from "native-base";
import { Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native";

const Single = ({route, navigation}) => {
  // console.log(route.params);
  const {
    title,
    description,
    filename,
    time_added: timeAdded,
    user_id: userId,
    media_type: type,
    file_id: fileId,
    filesize,
  } = route.params;
  const video = useRef(null);
  const [owner, setOwner] = useState({});
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const {user} = useContext(MainContext);
  const {getUserById} = useUser();
  const {deleteMedia} = useMedia();
  const toast = useToast();
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const owner = await getUserById(userId, token);
    console.log(owner);
    setOwner(owner);
  };

  const getLikes = async () => {
    const likes = await getFavouritesByFileId(fileId);
    setLikes(likes);
    // check if the current user id is included in the 'likes' array and
    // set the 'userLikesIt' state accordingly
    for (const like of likes) {
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
      console.log(error);
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

  const deleteFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteMedia(fileId, token);
    } catch (error) {
      console.log(error);
    }
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const showVideoInFullScreen = async () => {
    try {
      await video.current.presentFullscreenPlayer();
    } catch (error) {
      console.error('showVideoInFullScreen', error.message);
    }
  };

  useEffect(() => {
    getOwner();
    getLikes();
    unlock();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        if (video.current) showVideoInFullScreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, []);

  return (
    <>
      <ScrollView>
        <Box alignItems="center" mt="12px">
          <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" bg="#FFC56D">
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} initialFocusRef={initialRef} finalFocusRef={finalRef} size="full">
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{title}</Modal.Header>
                <Modal.Body>
                  <AspectRatio w="100%" ratio={4 / 3}>
                    <Image
                      source={{uri: uploadsUrl + filename }}
                      alt="recipeImage"
                    />
                  </AspectRatio>
                </Modal.Body>
              </Modal.Content>
            </Modal>
            <Box>
              <TouchableOpacity onPress={() => {
                setModalVisible(!modalVisible);
              }}>
                <AspectRatio w="100%" ratio={16 / 9}>
                  <Image
                    source={{uri: uploadsUrl + filename }}
                    alt="recipeImage"
                  />
                </AspectRatio>
              </TouchableOpacity>
              <HStack>
                <Center
                  _text={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: "md"
                }} position="absolute" bottom="0" px="3" py="1.5" w="100%" bg="primary.black:alpha.60">
                  {title}
                </Center>
              </HStack>
            </Box>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Text fontSize="xs" fontWeight="500" ml="-0.5" mt="-1">
                   recipe by: {owner.full_name} {owner.username}
                </Text>
                <Text>Total likes: {likes.length}</Text>
              </Stack>
              <Text color="white" fontWeight="400">
                {description}
              </Text>
              <HStack alignItems="center" space={4} justifyContent="space-between">
                <HStack alignItems="center">
                  <Text color="white" fontWeight="400">
                    {new Date(timeAdded).toLocaleString('fi-FI')}
                  </Text>
                </HStack>
              </HStack>
            </Stack>
          </Box>
        </Box>
      </ScrollView>
      <Center position="absolute" bottom="30px" right="30px" h="50px" w="50px" borderRadius="full" borderColor="coolGray.200" borderWidth="1" bg="#ff7300">
        {userLikesIt ? (
          <Icon name="favorite" color="red" onPress={() => {dislikeFile(); toast.show({
            description: "Removed from favorites"
          })}} />
        ) : (
          <Icon name="favorite-border" onPress={() => {likeFile(); toast.show({
            description: "Added to favorites"
          })}} />
        )}
      </Center>
      { user.user_id === owner.user_id && (
        <Center position="absolute" bottom="90px" right="30px" h="50px" w="50px" borderRadius="full"
                borderColor="coolGray.200" borderWidth="1" bg="#ff7300">
          <Icon name="delete" color="black" onPress={() => {
            deleteFile(fileId);
            toast.show({
              description: "File deleted"
            });
            navigation.navigate('Home'); console.log("user: " + user.user_id + " owner: " + owner.user_id)
          }}
          />
        </Center>
      )}
    </>
  );
};

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
