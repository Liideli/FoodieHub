import React, {useState} from 'react';
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

const Profile = ({navigation}) => {
  const {putUser, checkUsername} = useUser();
  const {
    control,
    getValues,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
    },
    mode: 'onBlur',
  });

  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('checkUser :DD', userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  const [toggleRecipes, setToggleRecipes] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const UpdateUser = async (updatedData) => {
    delete updatedData.confirmPassword;
    const {getUserByToken} = useUser();
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('userToken:', userToken);
    const userData = await getUserByToken(userToken);
    console.log('userdata:', userData);
    try {
      if (updatedData.username === '') {
        delete updatedData.username;
      }
      if (updatedData.email === '') {
        delete updatedData.email;
      }
      if (updatedData.password === '') {
        delete updatedData.password;
      }
      updatedData.token = userToken;
      console.log(':DD', errors);
      console.log('UpdateUser button pressed', updatedData);
      const updateResult = await putUser(updatedData);
      console.log('updated result', updateResult);
      setShowModal(false);
      toast.show({
        description: 'User information updated!',
        placement: 'bottom',
      });
    } catch (error) {
      console.error('UpdateUser :DDDD', error);
      toast.show({
        description: 'Update failed!',
        placement: 'bottom',
      });
    }
  };

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
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                        // rules={{required: {value: true, message: 'is required'}}}
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
                    <FormControl isInvalid={'password' in errors}>
                      <FormControl.Label
                        _text={{
                          fontSize: 'md',
                          fontFamily: 'JudsonRegular',
                          color: 'white',
                        }}
                      >
                        Password
                      </FormControl.Label>
                      <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                          <Input
                            placeholder="New password"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            type="password"
                            errorMessage={
                              errors.password && errors.password.message
                            }
                          />
                        )}
                        name="password"
                      />
                      <FormControl.ErrorMessage>
                        {errors.password?.message}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={'confirmPassword' in errors}>
                      <FormControl.Label
                        _text={{
                          fontSize: 'md',
                          fontFamily: 'JudsonRegular',
                          color: 'white',
                        }}
                      >
                        Confirm password
                      </FormControl.Label>
                      <Controller
                        control={control}
                        rules={{
                          validate: (value) => {
                            if (value === getValues('password')) {
                              return true;
                            } else {
                              return 'Passwords must match.';
                            }
                          },
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                          <Input
                            placeholder="Confirm new password"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            type="password"
                          />
                        )}
                        name="confirmPassword"
                      />
                      <FormControl.ErrorMessage>
                        {errors.confirmPassword?.message}
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
      <Box display="flex" flexDirection="row">
        <Button
          width="50%"
          borderRadius={0}
          borderWidth={1}
          borderLeftWidth={0}
          borderColor="black"
          onPress={() => {
            setToggleRecipes(true);
          }}
        >
          My recipes
        </Button>

        <Button
          width="50%"
          borderRadius={0}
          borderWidth={1}
          borderLeftWidth={0}
          borderColor="black"
          onPress={() => {
            setToggleRecipes(false);
          }}
        >
          My likes
        </Button>
      </Box>
      <Box backgroundColor="white" marginBottom={180}>
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
