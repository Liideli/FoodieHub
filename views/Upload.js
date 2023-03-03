import React, {useCallback, useContext, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Keyboard, ScrollView, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useFocusEffect} from '@react-navigation/native';
import { appId, uploadsUrl } from "../utils/variables";
import {Video} from 'expo-av';

import {
  AspectRatio,
  Box,
  FormControl,
  Heading,
  Image,
  Stack,
  Input,
  TextArea,
  Button,
  Center,
  Icon,
  Pressable
} from "native-base";

const Upload = ({navigation}) => {
  const [mediafile, setMediaFile] = useState({});
  const video = useRef(null);
  const [loading, setLoading] = useState(false);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
    trigger,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onChange',
  });

  const uploadFile = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = mediafile.uri.split('/').pop();
    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';
    const mimeType = mediafile.type + '/' + fileExt;
    formData.append('file', {
      uri: mediafile.uri,
      name: filename,
      type: mimeType,
    });
    console.log('form data', formData);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await postMedia(formData, token);
      const appTag = {file_id: result.file_id, tag: appId};
      const tagResult = await postTag(appTag, token);
      console.log('tag result', tagResult);

      Alert.alert('Upload OK', 'File id: ' + result.file_id, [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            // update 'update' state in context
            setUpdate(!update);
            // reset form
            // reset();
            // TODO: navigate to home
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('file upload failed', error);
    } finally {
      setLoading(false);
    }
  };

  const pickFile = async () => {
    // No permissions request is necessary for launching the image library
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      console.log(result);

      if (!result.canceled) {
        setMediaFile(result.assets[0]);
        // validate form
        trigger();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setMediaFile({});
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('leaving');
        resetForm();
      };
    }, [])
  );

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{padding: 16}}
        activeOpacity={1}
      >
        <Box alignItems="center" mt="12px">
          <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" bg="#FFC56D">
            <Box>
              <TouchableOpacity onPress={pickFile}>
                <AspectRatio w="100%" ratio={16 / 9}>
                  <Image
                    source={{uri: mediafile.uri || "https://content.hostgator.com/img/weebly_image_sample.png" }}
                    alt="recipeImage"
                  />
                </AspectRatio>
              </TouchableOpacity>
            </Box>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Heading
                  fontSize="xl"
                  fontWeight="500"
                  ml="-0.5"
                  mt="-1"
                >
                  Recipe name
                </Heading>
                <FormControl isRequired>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: 'is required',
                      },
                      minLength: {
                        value: 3,
                        message: 'Title min length is 3 characters.',
                      },
                    }}
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        placeholder="Title"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.title && errors.title.message}
                      />
                    )}
                    name="title"
                  />
                  <FormControl.ErrorMessage>{errors.title && errors.title.message}</FormControl.ErrorMessage>
                </FormControl>
              </Stack>
              <Stack space={2}>
                <Heading
                  fontSize="xl"
                  fontWeight="500"
                  ml="-0.5"
                  mt="-1"
                >
                  Ingredients and instructions
                </Heading>
                <FormControl isRequired>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: 'is required',
                      },
                      minLength: {
                        value: 3,
                        message: 'Add a description',
                      },
                    }}
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextArea
                        color="black"
                        h={40}
                        placeholder="Add Ingredients and Instructions here"
                        backgroundColor="white"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                    name="description"
                  />
                </FormControl>
              </Stack>
              <Button
                loading={loading}
                disabled={!mediafile.uri || errors.title || errors.description}
                onPress={pickFile}
                backgroundColor="#ff8282"
                borderRadius="full"
              >Add image</Button>
              <Button
                loading={loading}
                disabled={!mediafile.uri || errors.title || errors.description}
                onPress={handleSubmit(uploadFile)}
                backgroundColor="#FE5D26"
                borderRadius="full"
              >Upload recipe</Button>
            </Stack>
          </Box>
        </Box>
      </TouchableOpacity>
    </ScrollView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
