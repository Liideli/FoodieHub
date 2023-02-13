import React, {useContext, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button, Text} from '@rneui/base';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const [toggleForm, setToggleForm] = useState(false);

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // If no token available, do nothing
      if (userToken === null) return;
      const userData = await getUserByToken(userToken);
      console.log('checkToken', userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('checkToken', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{padding: 16}}
        activeOpacity={1}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {toggleForm ? <LoginForm /> : <RegisterForm />}
          <Text>
            {toggleForm ? 'Create an account' : 'Already have an account?'}
          </Text>
          <Button
            type="outline"
            title={toggleForm ? 'Register' : 'Login'}
            onPress={() => {
              setToggleForm(!toggleForm);
            }}
          />
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </ScrollView>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
