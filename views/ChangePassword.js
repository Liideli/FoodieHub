import React, {useState} from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {Alert} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Entypo} from '@expo/vector-icons';

// NativeBase Components
import {
  Button,
  Box,
  Input,
  useToast,
  FormControl,
  Center,
  Heading,
  VStack,
  Pressable,
} from 'native-base';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';

// Creates a screen where the user can change their password
const ChangePassword = ({navigation}) => {
  const {user} = useContext(MainContext);
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const toast = useToast();

  const {putUser} = useUser();
  // Form controls
  const {
    control,
    getValues,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  // Function for saving the new password to the backend
  const UpdateUser = async (updatedData) => {
    // Delete the confirm password field, so it doesn't get sent to the backend
    // Database has no confirmpassword value
    delete updatedData.confirmPassword;
    const {getUserByToken} = useUser();
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('userToken:', userToken);
    const userData = await getUserByToken(userToken);
    console.log('userdata:', userData);
    try {
      updatedData.token = userToken;
      const updateResult = await putUser(updatedData);
      console.log('updated result', updateResult);
      // Shows an alert to the user when the password change is succesful
      // Logs out the user when they press close on the alert
      Alert.alert(
        'Password succesfully changed',
        'After pressing close, you will be logged out',
        [
          {
            text: 'Close',
            onPress: async () => {
              console.log('Logging out!');
              setUser({});
              setIsLoggedIn(false);
              try {
                await AsyncStorage.clear();
              } catch (e) {
                console.log('Clearning async storage failed', e);
              }
            },
          },
        ]
      );
    } catch (error) {
      // Shows a toast to the user if changing password failed
      // This should mostly happen when there's a server error
      console.error('Updatepassword ', error);
      toast.show({
        description: 'Update failed!',
        placement: 'bottom',
      });
    }
  };
  return (
    <Center w="100%" bg={['#FFC56D']}>
      <Box safeArea pr="6" pl="6" w="100%" h="100%">
        <Heading
          fontFamily="OpenSansRegular"
          size="lg"
          fontWeight="600"
          color="black"
        >
          Logged in as {user.username}.
        </Heading>
        <VStack space="2" mt="5">
          <FormControl isRequired isInvalid={'password' in errors}>
            <FormControl.Label
              _text={{
                fontSize: 'md',
                fontFamily: 'OpenSansRegular',
              }}
            >
              New password
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
                      <Entypo name={show ? 'eye-with-line' : 'eye'} size={24} />
                    </Pressable>
                  }
                />
              )}
              name="password"
            />
            <FormControl.ErrorMessage>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={'confirmPassword' in errors}>
            <FormControl.Label
              _text={{
                fontSize: 'md',
                fontFamily: 'OpenSansRegular',
              }}
            >
              Confirm new password
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
                        name={showTwo ? 'eye-with-line' : 'eye'}
                        size={24}
                      />
                    </Pressable>
                  }
                />
              )}
              name="confirmPassword"
            />
            <FormControl.ErrorMessage>
              {errors.confirmPassword?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button.Group space={2} alignSelf="center">
            <Button
              mt="2"
              onPress={() => {
                navigation.navigate('Home');
              }}
              _text={{
                fontFamily: 'OpenSansRegular',
                fontSize: 'xl',
              }}
            >
              Go back
            </Button>
            <Button
              mt="2"
              onPress={handleSubmit(UpdateUser)}
              _text={{
                fontFamily: 'OpenSansRegular',
                fontSize: 'xl',
              }}
            >
              Update
            </Button>
          </Button.Group>
        </VStack>
      </Box>
    </Center>
  );
};

ChangePassword.propTypes = {
  navigation: PropTypes.object,
};

export default ChangePassword;
