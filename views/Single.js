import React, {useContext, useEffect, useRef, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {useFavourite, useUser, useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  AspectRatio,
  Box, Button,
  Center, Fab,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ScrollView,
  Stack,
  Stagger,
  Text,
  TextArea,
  useDisclose,
  useToast,
  VStack
} from "native-base";
import { Icon } from "@rneui/themed";
import { Alert, TouchableOpacity } from "react-native";
import { Controller, useForm} from "react-hook-form";
import {AntDesign} from "@expo/vector-icons";

const Single = ({route, navigation}) => {
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
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onChange',
  });
  const video = useRef(null);
  const [owner, setOwner] = useState({});
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const {user} = useContext(MainContext);
  const {getUserById} = useUser();
  const {deleteMedia, putMedia} = useMedia();
  const toast = useToast();
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();
  const [loading, setLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);

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

  const updateFile = async (updatedData) => {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    try {
      if (updatedData.title === '') {
        updatedData.title = title;
      }
      if (updatedData.description === '') {
        updatedData.description = description;
      }
      updatedData.token = token;
      const updateResult = await putMedia(fileId, updatedData, token);
      navigation.navigate('Home');
      toast.show({
        description: "File updated"
      });
    } catch (error) {
      console.error('UpdateFile', error);
    } finally {
      setLoading(false);
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
      <ScrollView bg="#FFC56D">
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
              borderTopRadius="lg"
              _text={{
                color: "white",
                fontWeight: "700",
                fontSize: "3xl"
              }} position="absolute" bottom="0" px="3" py="1.5" w="100%"bg="primary.black:alpha.60">
              {title}
            </Center>
          </HStack>
        </Box>
        <Box w="95%" margin="12px" backgroundColor="white" rounded="lg" overflow="hidden" shadow="7">
          <Stack p="4" space={3}>
            <VStack space={1}>
              <Text fontSize="xs" fontWeight="500" ml="-0.5" mt="-1" color="black">
                Recipe by: {owner.full_name} {owner.username}
              </Text>
              <Text color="black" fontSize="xs">Total likes: {likes.length}</Text>
            </VStack>
            <Box rounded="lg" overflow="hidden" borderColor="coolGray.300" borderWidth="1" bg="white"
                 padding="8px"
            >
              <Text fontSize="lg" color="black" bold paddingBottom="6px">Recipe and ingredients</Text>
              <Text color="black" fontWeight="400">
                {description}
              </Text>
            </Box>
            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems="center">
                <Text color="light.400" fontWeight="400" fontSize="sm">
                  Posted: {" "}
                  {new Date(timeAdded).toLocaleString('fi-FI')}
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </Box>
        <Box backgroundColor="white" rounded="lg" overflow="hidden" shadow="7" margin="12px">
          <VStack>
            <Text bold fontSize="lg" color="black" padding="8px">Comments</Text>
            <Center padding="24px" borderBottomWidth="1px" borderBottomColor="coolGray.300">
              <Text italic color="coolGray.500"> No comments yet</Text>
            </Center>
            <Box backgroundColor="white" rounded="lg" overflow="hidden" shadow="7" margin="12px">
              <HStack padding="2px">
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      minLength: 10,
                      message: 'New description must be at least 10 characters',
                    },
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextArea
                      placeholder="Add a comment"
                      h={20}
                      w="80%"
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                      type="text"
                      color="black"
                      backgroundColor="white"
                      errorMessage={
                        errors.comment && errors.comment.message
                      }
                    />
                  )}
                  name="comment"
                />
                <Center w="20%" backgroundColor="green.500"  borderRightRadius="lg">
                  <Center h="40px" w="40px" borderRadius="full" borderColor="white" borderWidth="2">
                    <Icon
                      name="send"
                      color="white"
                      onPress={() => {toast.show({
                        description: "comment posted"
                      })}}
                    />
                  </Center>
                </Center>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
      <Center position="absolute" top="10px" right="20px" h="50px" w="50px" borderRadius="full" bg="#ff7300" shadow="7">
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
        <Center position="absolute" top="70px" right="20px" h="50px" w="50px" borderRadius="full" bg="#ff7300" shadow="7">
          <Icon name="delete" color="black" onPress={() => {
            deleteFile(fileId);
            toast.show({
              description: "File deleted"
            });
            navigation.navigate('Home');
          }}
          />
        </Center>
      )}
      <Modal isOpen={modalEditVisible} onClose={() => setModalEditVisible(false)} initialFocusRef={initialRef} finalFocusRef={finalRef} size="full">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Edit recipe {" " + title}</Modal.Header>
          <Modal.Body>
            <Box>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    placeholder="Change recipe title"
                    onBlur={onBlur}
                    value={value}
                    onChangeText={onChange}
                    type="text"
                    errorMessage={
                      errors.title && errors.title.message
                    }
                  />
                )}
                name="title"
              />
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    minLength: 10,
                    message: 'New description must be at least 10 characters',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextArea
                    placeholder="Change description"
                    h={40}
                    onBlur={onBlur}
                    value={value}
                    onChangeText={onChange}
                    type="text"
                    color="black"
                    backgroundColor="white"
                    errorMessage={
                      errors.description && errors.description.message
                    }
                  />
                )}
                name="description"
              />
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                onPress={() => {
                  setModalEditVisible(!modalEditVisible);
                }}
              >
                Cancel
              </Button>
              <Button onPress={handleSubmit(updateFile)}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      { user.user_id === owner.user_id && (
        <Center position="absolute" top="130px" right="20px" h="50px" w="50px" borderRadius="full" bg="#ff7300" shadow="7">
          <Icon name="edit" color="black" onPress={() => {
            setModalEditVisible(!modalEditVisible);
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
