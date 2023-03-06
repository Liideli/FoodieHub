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
  ScrollView,
  KeyboardAvoidingView,
  Button,
} from 'native-base';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const {toggleForm, setToggleForm} = useContext(MainContext);

  const onRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setTimeout(() => {
        setRefreshing(true);
        setRefreshing(false);
      }, 250);
      setLoading(false);
    }, 700);
  }, [refreshing]);

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
      bg={['#FFC56D']}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {!refreshing && (
        <ScrollView
          mt="10"
          bg={['#FFC56D']}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        >
          <Center safeArea>
            {toggleForm ? <LoginForm /> : <RegisterForm />}
            <Box>
              <HStack justifyContent="center">
                <VStack w="100%" px="6">
                  <Center>
                    {toggleForm ? (
                      <Button
                        _text={{
                          fontFamily: 'JudsonRegular',
                          fontSize: 'lg',
                        }}
                        width="100%"
                        variant="outline"
                        outlineColor="black"
                        title="Sign In"
                        onPress={() => {
                          setToggleForm(!toggleForm);
                        }}
                      >
                        Sign Up
                      </Button>
                    ) : (
                      <Button
                        _text={{
                          fontFamily: 'JudsonRegular',
                          fontSize: 'lg',
                        }}
                        width="100%"
                        variant="outline"
                        outlineColor="black"
                        title="Sign In"
                        onPress={() => {
                          setToggleForm(!toggleForm);
                        }}
                      >
                        Sign In
                      </Button>
                    )}
                  </Center>
                </VStack>
              </HStack>
            </Box>
          </Center>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
