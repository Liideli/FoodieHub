import React, {useContext, useState} from 'react';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
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
  useToast,
} from 'native-base';

const RegisterForm = (props) => {
  const {postUser, checkUsername} = useUser();
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const {toggleForm, setToggleForm} = useContext(MainContext);
  const toast = useToast();
  const {
    control,
    getValues,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  const register = async (registerData) => {
    delete registerData.confirmPassword;
    console.log('Registering: ', registerData);
    try {
      const registerResult = await postUser(registerData);
      setToggleForm(!toggleForm);
      console.log('registeration result', registerResult);
      toast.show({
        title: 'Register successful!',
        description: 'Please login.',
        placement: 'top',
      });
    } catch (error) {
      console.error('register', error);
    }
  };

  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('checkUser', userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  return (
    <Center w="100%" bg={['#FFC56D']}>
      <Box safeArea pr="6" pl="6" w="100%">
        <Heading
          fontFamily="JudsonRegular"
          size="xl"
          fontWeight="600"
          color="black"
        >
          Welcome to FoodieHub!
        </Heading>
        <Heading
          fontFamily="JudsonRegular"
          color="coolGray.600"
          mt="1"
          fontWeight="medium"
          size="md"
        >
          Register to continue.
        </Heading>

        <VStack space="2" mt="5" mb="-4">
          <FormControl isRequired isInvalid={'email' in errors}>
            <FormControl.Label
              _text={{
                fontSize: 'md',
                fontFamily: 'JudsonRegular',
              }}
            >
              Email
            </FormControl.Label>
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Email is required.'},
                pattern: {
                  value: /^[a-z0-9.-]{1,64}@[a-z0-9.-]{3,64}/i,
                  message: 'Must be a valid email.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
              name="email"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.email?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={'full_name' in errors}>
            <FormControl.Label
              _text={{
                fontSize: 'md',
                fontFamily: 'JudsonRegular',
              }}
            >
              Full Name
            </FormControl.Label>
            <Controller
              control={control}
              rules={{
                minLength: {value: 3, message: 'Must be at least 3 chars.'},
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="words"
                />
              )}
              name="full_name"
            />
            <FormControl.ErrorMessage>
              {errors.full_name?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={'username' in errors}>
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
              rules={{
                required: {value: true, message: 'Username is required.'},
                minLength: {
                  value: 3,
                  message: 'Username min length is 3 characters.',
                },
                validate: checkUser,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
              name="username"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.username?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={'password' in errors}>
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
              rules={{
                required: {
                  value: true,
                  message:
                    'Min 5 characters, needs one number and one uppercase letter.',
                },
                pattern: {
                  value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
                  message:
                    'Min 5 characters, needs one number and one uppercase letter.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  type={show ? 'text' : 'password'}
                  InputRightElement={
                    <Pressable onPress={() => setShow(!show)} pr="1">
                      <Entypo name={show ? 'eye' : 'eye-with-line'} size={24} />
                    </Pressable>
                  }
                />
              )}
              name="password"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={'confirmPassword' in errors}>
            <FormControl.Label
              _text={{
                fontSize: 'md',
                fontFamily: 'JudsonRegular',
              }}
            >
              Confirm password
            </FormControl.Label>
            <Controller
              control={control}
              rules={{
                validate: (value) => {
                  if (value === getValues('password')) {
                    return true;
                  } else {
                    return 'Passwords must match.';
                  }
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  type={showTwo ? 'text' : 'password'}
                  InputRightElement={
                    <Pressable onPress={() => setShowTwo(!showTwo)} pr="1">
                      <Entypo
                        name={showTwo ? 'eye' : 'eye-with-line'}
                        size={24}
                      />
                    </Pressable>
                  }
                />
              )}
              name="confirmPassword"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.confirmPassword?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            mt="2"
            onPress={handleSubmit(register)}
            _text={{
              fontFamily: 'JudsonRegular',
              fontSize: 'xl',
            }}
          >
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default RegisterForm;
