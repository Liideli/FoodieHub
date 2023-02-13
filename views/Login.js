import React, {useContext, useEffect, useState} from 'react';
import {Keyboard, ScrollView, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button, Card, Text} from '@rneui/base';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [toggleForm, setToggleForm] = useState(true);

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // if no token available, do nothing
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
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        {toggleForm ? <LoginForm /> : <RegisterForm />}
        <Card>
          <Text>
            {toggleForm
              ? 'No account yet? Please register.'
              : 'Already have an account? Please login.'}
          </Text>
          <Button
            type="outline"
            title={toggleForm ? 'Go to register' : 'Go to login'}
            onPress={() => {
              setToggleForm(!toggleForm);
            }}
          />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
