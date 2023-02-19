import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthentication} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Entypo} from '@expo/vector-icons';
import {
  Box,
  Center,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Pressable,
} from 'native-base';

const LoginForm = (props) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useAuthentication();
  const [show, setShow] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const logIn = async (loginData) => {
    console.log('Login button pressed', loginData);
    // const data = {username: 'roopekl', password: 'salasana123'};
    try {
      const loginResult = await postLogin(loginData);
      console.log('logIn', loginResult);
      await AsyncStorage.setItem('userToken', loginResult.token);
      setUser(loginResult.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('logIn', error);
      // TODO: notify user about failed login attempt
    }
  };

  return (
    <Center w="100%" bg={['#FFC56D']}>
      <Box safeArea pr="6" pl="6" w="100%" backgroundColor="#FFC56D">
        <Heading
          fontFamily="JudsonRegular"
          size="2xl"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: 'warmGray.50',
          }}
        >
          Welcome
        </Heading>
        <Heading
          fontFamily="JudsonRegular"
          mt="1"
          _dark={{
            color: 'warmGray.200',
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="md"
        >
          Login to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isInvalid={'username' in errors}>
            <FormControl.Label
              _text={{
                fontSize: 'md',
                fontFamily: 'JudsonRegular',
              }}
            >
              Username
            </FormControl.Label>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  variant="filled"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
              name="username"
              rules={{required: 'Field is required', minLength: 3}}
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
                fontFamily: 'JudsonRegular',
              }}
            >
              Password
            </FormControl.Label>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  variant="filled"
                  type={show ? 'text' : 'password'}
                  InputRightElement={
                    <Pressable onPress={() => setShow(!show)}>
                      <Entypo name={show ? 'eye' : 'eye-with-line'} size={24} />
                    </Pressable>
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="password"
              rules={{required: 'Field is required', minLength: 3}}
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            backgroundColor="#FE5D26"
            mt="2"
            colorScheme="indigo"
            onPress={handleSubmit(logIn)}
            _text={{
              fontFamily: 'JudsonRegular',
              fontSize: 'xl',
            }}
          >
            Sign In
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginForm;
