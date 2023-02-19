/* eslint-disable react/no-unescaped-entities */
import React, {useContext, useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Box, Center, HStack, VStack, Link, ScrollView} from 'native-base';

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
    <ScrollView bg={['#FFC56D']}>
      <Center h="100%" onPress={() => Keyboard.dismiss()}>
        {toggleForm ? <LoginForm /> : <RegisterForm />}
        <Box>
          <VStack pb="20">
            <HStack justifyContent="center">
              {toggleForm ? (
                <Link
                  type="outline"
                  title="Sign Up"
                  onPress={() => {
                    setToggleForm(!toggleForm);
                  }}
                  _text={{
                    fontFamily: 'JudsonRegular',
                    color: 'indigo.500',
                    fontWeight: 'medium',
                    fontSize: 'md',
                  }}
                  href="#"
                >
                  {' '}
                  Sign Up
                </Link>
              ) : (
                <Link
                  type="outline"
                  title="Sign In"
                  onPress={() => {
                    setToggleForm(!toggleForm);
                  }}
                  _text={{
                    fontFamily: 'JudsonRegular',
                    color: 'indigo.500',
                    fontWeight: 'medium',
                    fontSize: 'md',
                  }}
                  href="#"
                >
                  {' '}
                  Sign In
                </Link>
              )}
            </HStack>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
