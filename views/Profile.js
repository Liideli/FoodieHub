import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import List from '../components/List';
import {View, Text, Button, KeyboardAvoidingView, Avatar} from 'native-base';
import UpdateForm from '../components/UpdateForm';
import PropTypes from 'prop-types';

const Profile = ({navigation}) => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [toggleProfile, setToggleProfile] = useState(true);
  const [toggleRecipes, setToggleRecipes] = useState(true);

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
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
      {toggleProfile ? (
        <View
          width="100%"
          height="25%"
          display="flex"
          flexDirection="row"
          backgroundColor="#FFC56D"
        >
          <View
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            width="75%"
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
            <Text fontSize="2xl">{user.username}</Text>
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
      ) : (
        <View backgroundColor="#FFC56D">
          <UpdateForm />
        </View>
      )}
      <View display="flex" flexDirection="row">
        <View width="33.3%">
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
        <View width="33.3%">
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
        <View width="33.3%">
          <Button
            borderRadius={0}
            borderWidth={1}
            borderLeftWidth={0}
            borderColor="black"
            onPress={() => {
              setToggleProfile(!toggleProfile);
            }}
          >
            {toggleProfile ? 'Update user' : 'Back to profile'}
          </Button>
        </View>
      </View>
      <View>
        {toggleRecipes ? (
          <List navigation={navigation} myFilesOnly={true} />
        ) : (
          <View></View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
