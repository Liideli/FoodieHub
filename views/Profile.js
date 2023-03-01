import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import List from '../components/List';
import {Alert, Platform} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import {Controller, useForm} from 'react-hook-form';
import {
  Text,
  Button,
  Box,
  Avatar,
  Modal,
  Input,
  KeyboardAvoidingView,
} from 'native-base';
import PropTypes from 'prop-types';

const Profile = ({navigation}) => {
  const {putUser} = useUser();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      email: '',
    },
  });
  const {getFilesByTag} = useTag();
  const {user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [toggleRecipes, setToggleRecipes] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  const UpdateUser = async (updatedData) => {
    const {getUserByToken} = useUser();
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('userToken:', userToken);
    const userData = await getUserByToken(userToken);
    console.log('userdata:', userData);
    try {
      if (updatedData.username === '') {
        updatedData.username = userData.username;
      }
      if (updatedData.email === '') {
        updatedData.email = userData.email;
      }
      updatedData.token = userToken;
      console.log('UpdateUser button pressed', updatedData);
      const updateResult = await putUser(updatedData);
      console.log('updated result', updateResult);
      Alert.alert('User information updated', '', [
        {text: 'Close', onPress: () => setShowModal(false)},
      ]);
    } catch (error) {
      console.error('UpdateUser', error);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      bg={['#FFC56D']}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Box width="100%" display="flex">
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="flex-start"
          flexDirection="row"
          flexWrap="wrap"
          marginY={5}
        >
          <Avatar
            size="2xl"
            borderWidth={1}
            borderColor={'black'}
            marginX={5}
            source={{uri: uploadsUrl + avatar}}
            alt="User avatar"
          />
          <Box>
            <Text fontSize="2xl">{user.username}</Text>
          </Box>
          <Box width="15%">
            <Button
              onPress={() => setShowModal(true)}
              backgroundColor="#FFC56D"
            >
              <FontAwesome5 name="user-edit" size={24} color="black" />
            </Button>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              avoidKeyboard
            >
              <KeyboardAvoidingView
                display="flex"
                width="100%"
                alignItems="center"
                borderRadius={20}
                marginBottom={75}
              >
                <Modal.Content>
                  <Modal.CloseButton />
                  <Modal.Header>Update user information</Modal.Header>
                  <Modal.Body>
                    <Box>
                      <Controller
                        control={control}
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
                      <Controller
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            minLength: 5,
                            message: 'Password must be at lest 5 letters',
                          },
                        }}
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
                      <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                          <Input
                            placeholder="New email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            type="text"
                          />
                        )}
                        name="email"
                      />
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
      </Box>
      <Box display="flex" flexDirection="row">
        <Box width="50%">
          <Button
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
        </Box>
        <Box width="50%">
          <Button
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
      </Box>
      <Box>
        {toggleRecipes ? (
          <List navigation={navigation} myFilesOnly={true} />
        ) : (
          <Box>
            <List navigation={navigation} MyFavouritesOnly={true} />
          </Box>
        )}
      </Box>
    </KeyboardAvoidingView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
