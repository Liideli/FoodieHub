import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Button, Input} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import {Alert} from 'react-native';
import {useUser} from '../hooks/ApiHooks';

const Update = () => {
  const {putUser} = useUser();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      email: '',
    },
  });

  const UpdateUser = async (updatedData) => {
    const {getUserByToken} = useUser();
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('userToken:', userToken);
    const userData = await getUserByToken(userToken);
    console.log('userdata:', userData);
    try {
      if (updatedData.username === '') {
        updatedData.username = userData.username;
      }
      if (updatedData.email === '') {
        updatedData.email = userData.email;
      }
      updatedData.token = userToken;
      console.log('UpdateUser button pressed', updatedData);
      const updateResult = await putUser(updatedData);
      console.log('updated result', updateResult);
      Alert.alert('User information succesfully updated');
    } catch (error) {
      console.error('UpdateUser', error);
    }
  };

  return (
    <View
      display="flex"
      alignSelf="center"
      width="80%"
      borderRadius={20}
      margin={10}
    >
      <Controller
        control={control}
        // rules={{required: {value: true, message: 'is required'}}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="New username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            type="text"
            backgroundColor="white"
            focusOutlineColor="#FE5D26"
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            minLength: 5,
            message: 'Password must be at lest 5 letters',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="New password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            type="password"
            backgroundColor="white"
            focusOutlineColor="#FE5D26"
            errorMessage={errors.password && errors.password.message}
          />
        )}
        name="password"
      />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="New email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            type="text"
            backgroundColor="white"
            focusOutlineColor="#FE5D26"
          />
        )}
        name="email"
      />
      <Button
        backgroundColor="#FE5D26"
        borderRadius={10}
        _text={{
          color: 'black',
        }}
        onPress={handleSubmit(UpdateUser)}
      >
        Update
      </Button>
    </View>
  );
};

export default Update;
