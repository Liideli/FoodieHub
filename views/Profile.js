import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import List from '../components/List';
import {Alert} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  Avatar,
  Modal,
  Input,
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
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
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
      backgroundColor="#FFFFFF"
      display="flex"
      height="100%"
    >
      <View
        width="100%"
        height="25%"
        display="flex"
        flexDirection="row"
        backgroundColor="#FFC56D"
      >
        <View
          display="flex"
          width="75%"
          alignItems="center"
          justifyContent="flex-start"
          flexDirection="row"
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
          <View width="40%">
            <Text fontSize="2xl">{user.username}</Text>
          </View>
          <View display="flex">
            <Button marginLeft={2} onPress={() => setShowModal(true)}>
              Update profile
            </Button>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Update user information</Modal.Header>
                <Modal.Body>
                  <View
                    display="flex"
                    alignSelf="center"
                    width="80%"
                    borderRadius={20}
                    margin={10}
                  >
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
                  </View>
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
            </Modal>
          </View>
        </View>
        <View
          display="flex"
          width="25%"
          borderRadius={10}
          alignSelf="flex-end"
          padding={2}
        >
          <Button
            onPress={async () => {
              console.log('Logging out!');
              setUser({});
              setIsLoggedIn(false);
              try {
                await AsyncStorage.clear();
              } catch (e) {
                console.log('Clearning async storage failed', e);
              }
            }}
          >
            Log Out
          </Button>
        </View>
      </View>
      <View display="flex" flexDirection="row">
        <View width="50%">
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
        </View>
        <View width="50%">
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
        </View>
      </View>
      <View>
        {toggleRecipes ? (
          <List navigation={navigation} myFilesOnly={true} />
        ) : (
          <View>
            <List navigation={navigation} MyFavouritesOnly={true} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
