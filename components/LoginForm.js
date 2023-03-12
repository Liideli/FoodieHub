import React, {useContext, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthentication} from '../hooks/ApiHooks';
import {useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Entypo} from '@expo/vector-icons';

// NativeBase Components
import {
  Box,
  Center,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Pressable,
  useToast,
} from 'native-base';

const LoginForm = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useAuthentication();
  const {getUserByToken} = useUser();
  const [show, setShow] = useState(false);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  // Post login and get the result in toast accordingly
  const logIn = async (loginData) => {
    console.log('Login button pressed', loginData);
    try {
      const loginResult = await postLogin(loginData);
      console.log('logIn', loginResult);
      await AsyncStorage.setItem('userToken', loginResult.token);
      const loggedInUser = await getUserByToken(loginResult.token);
      toast.show({
        placement: 'bottom',
        bottom: 20,
        description: 'Welcome ' + loggedInUser.username + '!',
      });
      setUser(loginResult.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('logIn', error);
      toast.show({
        description: 'Wrong username or password!',
        placement: 'top',
      });
    }
  };

  return (
    <Center w="100%" bg={['#FFC56D']} mb={0}>
      <Box safeArea pr="6" pl="6" w="100%">
        <Heading size="lg" fontFamily="Lobster" color="black">
          Welcome to FoodieHub!
        </Heading>
        <Heading mt="1" color="coolGray.600" fontWeight="medium" size="sm">
          Login to continue.
        </Heading>

        <VStack space="2" mt="5">
          <FormControl isInvalid={'username' in errors}>
            <FormControl.Label
              _text={{
                fontSize: 'md',
                fontFamily: 'OpenSansRegular',
              }}
            >
              Username
            </FormControl.Label>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
              name="username"
              rules={{required: 'Field is required.'}}
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.username?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={'password' in errors}>
            <FormControl.Label
              _text={{
                fontSize: 'md',
                fontFamily: 'OpenSansRegular',
              }}
            >
              Password
            </FormControl.Label>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  type={show ? 'text' : 'password'}
                  InputRightElement={
                    <Pressable onPress={() => setShow(!show)} pr="1">
                      <Entypo name={show ? 'eye-with-line' : 'eye'} size={24} />
                    </Pressable>
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="password"
              rules={{required: 'Field is required.'}}
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button mt="2" onPress={handleSubmit(logIn)}>
            Sign In
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginForm;
