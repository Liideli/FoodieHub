import React, {useCallback, useContext, useState, useRef} from 'react';
import {Platform} from 'react-native';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {Keyboard, ScrollView, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useFocusEffect} from '@react-navigation/native';
import {appId, uploadsUrl} from '../utils/variables';
import {MaterialIcons} from '@expo/vector-icons';

// NativeBase Components
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
  KeyboardAvoidingView,
  Select,
  CheckIcon,
  WarningOutlineIcon,
  useToast,
  HStack,
  IconButton,
} from 'native-base';

const Upload = ({navigation}) => {
  const [mediafile, setMediaFile] = useState({});
  const [loading, setLoading] = useState(false);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
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
  const [cooktime, setCookTime] = React.useState('');
  const toast = useToast();
  const [editValue, setEditValue] = React.useState('');
  const {update, setUpdate} = useContext(MainContext);

  const uploadFile = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', cooktime + data.description);
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
      toast.show({
        description: 'Recipe added',
      });
      setUpdate(!update);
      navigation.navigate('Home');
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
    setEditValue('');
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
    <KeyboardAvoidingView
      style={{flex: 1}}
      bg={['#FFC56D']}
      behavior="position"
      keyboardVerticalOffset={-200}
    >
      <ScrollView>
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          style={{padding: 16}}
          activeOpacity={1}
        >
          <Box>
            <TouchableOpacity onPress={pickFile}>
              <AspectRatio w="100%" ratio={16 / 9}>
                <Image
                  source={{
                    uri:
                      mediafile.uri ||
                      'https://content.hostgator.com/img/weebly_image_sample.png',
                  }}
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
                color="black"
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
                <FormControl.ErrorMessage>
                  {errors.title && errors.title.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </Stack>
            <Stack space={2}>
              <Heading
                fontSize="xl"
                fontWeight="500"
                ml="-0.5"
                mt="-1"
                color="black"
              >
                Ingredients and instructions
              </Heading>
              <Box>
                <HStack
                  justifyContent="space-between"
                  bg="#ffefcc"
                  borderTopRadius="lg"
                  borderWidth="1px"
                  borderColor="#99907c"
                >
                  <IconButton
                    onPress={() => setEditValue(editValue + '\n•')}
                    variant="solid"
                    borderRadius="0px"
                    borderTopLeftRadius="lg"
                    bg="#ffefcc"
                    _icon={{
                      as: MaterialIcons,
                      name: 'format-list-bulleted',
                      color: 'black',
                    }}
                  ></IconButton>
                  <Button
                    onPress={() => setEditValue(editValue + '°C')}
                    variant="solid"
                    borderRadius="0px"
                    bg="#ffefcc"
                  >
                    °C
                  </Button>
                  <Button
                    onPress={() => setEditValue(editValue + '°F')}
                    variant="solid"
                    borderRadius="0px"
                    bg="#ffefcc"
                  >
                    °F
                  </Button>
                  <Button
                    onPress={() => setEditValue(editValue + '½')}
                    variant="solid"
                    borderRadius="0px"
                    bg="#ffefcc"
                  >
                    ½
                  </Button>
                  <Button
                    onPress={() => setEditValue(editValue + '¼')}
                    variant="solid"
                    borderRadius="0px"
                    bg="#ffefcc"
                  >
                    ¼
                  </Button>
                  <Button
                    onPress={() => setEditValue(editValue + '¾')}
                    variant="solid"
                    borderRadius="0px"
                    bg="#ffefcc"
                  >
                    ¾
                  </Button>
                  <IconButton
                    onPress={() => setEditValue('')}
                    variant="solid"
                    borderRadius="0px"
                    bg="#ffefcc"
                    borderTopRightRadius="lg"
                    _icon={{
                      as: MaterialIcons,
                      name: 'delete-sweep',
                      color: '#ff2b2b',
                    }}
                  ></IconButton>
                </HStack>
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
                        borderRadius="0px"
                        h={40}
                        defaultValue={editValue}
                        placeholder="Add Ingredients and Instructions here"
                        backgroundColor="white"
                        onBlur={onBlur}
                        onChangeText={(text) => {
                          setEditValue(text);
                          onChange(text);
                        }}
                      />
                    )}
                    name="description"
                  />
                </FormControl>
              </Box>
            </Stack>
            <FormControl maxW="300" isRequired isInvalid>
              <Heading
                fontSize="xl"
                fontWeight="500"
                ml="-0.5"
                mt="-1"
                color="black"
              >
                Select cooking time
              </Heading>
              <Select
                selectedValue={cooktime}
                minWidth="200"
                placeholder="Cook time"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size={5} />,
                }}
                mt="1"
                onValueChange={(itemValue) => setCookTime(itemValue)}
              >
                <Select.Item
                  label="5 minutes"
                  value="Cooking time for this recipe is 5 minutes."
                />
                <Select.Item
                  label="15 minutes"
                  value="Cooking time for this recipe is 15 minutes. "
                />
                <Select.Item
                  label="30 minutes"
                  value="Cooking time for this recipe is 30 minutes. "
                />
                <Select.Item
                  label="45 minutes"
                  value="Cooking time for this recipe is 45 minutes. "
                />
                <Select.Item
                  label="1 hour"
                  value="Cooking time for this recipe is 1 hour. "
                />
                <Select.Item
                  label="1.5 hours"
                  value="Cooking time for this recipe is 1.5 hours. "
                />
                <Select.Item
                  label="2 hours"
                  value="Cooking time for this recipe is 2 hours. "
                />
                <Select.Item
                  label="+2 hours"
                  value="Cooking time for this recipe is +2 hours. "
                />
              </Select>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Please make a selection!
              </FormControl.ErrorMessage>
            </FormControl>
            <Button onPress={pickFile} borderRadius="full">
              Add image
            </Button>
            <Button
              loading={loading}
              disabled={!mediafile.uri || errors.title || errors.description}
              onPress={handleSubmit(uploadFile)}
              borderRadius="full"
            >
              Upload recipe
            </Button>
          </Stack>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Upload;
