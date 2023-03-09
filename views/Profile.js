import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import List from '../components/List';
import AvatarName from '../components/UserAvatar';
import {Platform} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import {Controller, useForm} from 'react-hook-form';
import PropTypes from 'prop-types';

// NativeBase Components
import {
  Button,
  Box,
  Modal,
  Input,
  KeyboardAvoidingView,
  useToast,
  FormControl,
} from 'native-base';
import {MainContext} from '../contexts/MainContext';

const Profile = ({navigation}) => {
  // form controls
  const {putUser, checkUsername} = useUser();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
    },
    mode: 'onBlur',
  });

  // Checks if the username is available or not. Updates in real in the screen.
  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  // Define state changes
  const [toggleRecipes, setToggleRecipes] = useState(true);
  const [isfocused, setFocus] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const {update} = useContext(MainContext);
  const toast = useToast();

  // Saves the form data to the backend
  const UpdateUser = async (updatedData) => {
    // If the fields are empty, the app doesn't send data to the backend
    if (updatedData.username === '' && updatedData.email === '') {
      toast.show({
        description: 'Please fill out a field',
        placement: 'bottom',
      });
    } else {
      const {getUserByToken} = useUser();
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('userToken:', userToken);
      const userData = await getUserByToken(userToken);
      console.log('userdata:', userData);
      // Remove empty fields from the form data to keep the current values
      try {
        if (updatedData.username === '') {
          delete updatedData.username;
        }
        if (updatedData.email === '') {
          delete updatedData.email;
        }
        updatedData.token = userToken;
        const updateResult = await putUser(updatedData);
        console.log('updated result', updateResult);
        // Close the modal after succesfull update
        setShowModal(false);
        toast.show({
          description: 'User information updated!',
          placement: 'bottom',
        });
      } catch (error) {
        console.error('UpdateUser', error);
        toast.show({
          description: 'Update failed!',
          placement: 'bottom',
        });
      }
    }
  };

  // Set my likes as the default tab on the profile page when the app state changes.
  useEffect(() => {
    setToggleRecipes(true);
    setFocus(true);
  }, [update]);

  return (
    <Box
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      backgroundColor="white"
    >
      <Box
        display="flex"
        width="100%"
        alignItems="center"
        justifyContent="flex-start"
        flexDirection="row"
        flexWrap="wrap"
        paddingY={3}
        backgroundColor="#FFC56D"
      >
        <AvatarName />
        {/* opens the user information modal when pressing on the button */}
        <Box width="13%">
          <Button onPress={() => setShowModal(true)} backgroundColor="#FFC56D">
            <FontAwesome5 name="user-edit" size={24} color="black" />
          </Button>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            avoidKeyboard
          >
            <KeyboardAvoidingView
              display="flex"
              alignItems="center"
              borderRadius={20}
              behavior="position"
              width="100%"
            >
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Update user information</Modal.Header>
                <Modal.Body>
                  <Box>
                    <FormControl isInvalid={'email' in errors}>
                      <FormControl.HelperText>
                        Leave any of the fields empty to not change their value
                      </FormControl.HelperText>
                      <FormControl.Label
                        _text={{
                          fontSize: 'md',
                          fontFamily: 'JudsonRegular',
                          color: 'white',
                        }}
                      >
                        Email
                      </FormControl.Label>
                      <Controller
                        control={control}
                        rules={{
                          pattern: {
                            value: /^[a-z0-9.-]{1,64}@[a-z0-9.-]{3,64}/i,
                            message: 'Must be a valid email.',
                          },
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                          <Input
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            type="text"
                            placeholder="New email"
                          />
                        )}
                        name="email"
                      />
                      <FormControl.ErrorMessage>
                        {errors.email?.message}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={'username' in errors}>
                      <FormControl.Label
                        _text={{
                          fontSize: 'md',
                          fontFamily: 'JudsonRegular',
                          color: 'white',
                        }}
                      >
                        Username
                      </FormControl.Label>
                      <Controller
                        control={control}
                        rules={{
                          validate: checkUser,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                          <Input
                            placeholder="New username"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            type="text"
                            errorMessage={
                              errors.username && errors.username.message
                            }
                          />
                        )}
                        name="username"
                      />
                      <FormControl.ErrorMessage>
                        {errors.username?.message}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      onPress={() => {
                        setShowModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onPress={handleSubmit(UpdateUser)}>Save</Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </KeyboardAvoidingView>
          </Modal>
        </Box>
      </Box>
      {/* Onpress on buttons changes the values to true or false to display My recipes or My likes.
          Background colour changes depending on the value of isfocused to "highlight" the tab currently showing */}
      <Box display="flex" flexDirection="row">
        <Button
          width="50%"
          borderRadius={0}
          borderWidth={1}
          borderRightWidth={0}
          borderColor="black"
          backgroundColor={isfocused ? '#CC5500' : '#FE5D26'}
          onPress={() => {
            setToggleRecipes(true);
            setFocus(true);
          }}
        >
          My recipes
        </Button>

        <Button
          width="50%"
          borderRadius={0}
          borderWidth={1}
          borderColor="black"
          backgroundColor={isfocused ? '#FE5D26' : '#CC5500'}
          onPress={() => {
            setToggleRecipes(false);
            setFocus(false);
          }}
        >
          My likes
        </Button>
      </Box>
      <Box backgroundColor="white" marginBottom={180}>
        {/* Displays a different list (My recipes or My likes) based on if toggleRecipe is true or false. */}
        {toggleRecipes ? (
          <List navigation={navigation} myFilesOnly={true} />
        ) : (
          <Box>
            <List navigation={navigation} MyFavouritesOnly={true} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
