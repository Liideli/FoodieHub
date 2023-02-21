/* eslint-disable react/no-unescaped-entities */
import React, {useContext, useEffect, useState, useCallback} from 'react';
import {Platform, RefreshControl} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {
  Box,
  Center,
  HStack,
  VStack,
  Link,
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [toggleForm, setToggleForm] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

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
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        bg={['#FFC56D']}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Center safeArea>
          {toggleForm ? <LoginForm /> : <RegisterForm />}
          <Box>
            <VStack>
              <HStack justifyContent="center">
                {toggleForm ? (
                  <Link
                    mb={100}
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
                    mb={100}
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
    </KeyboardAvoidingView>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
