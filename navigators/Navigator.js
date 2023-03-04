import React, {useContext} from 'react';
import {Image} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import Home from '../views/Home';
import Single from '../views/Single';
import Search from '../views/Search';
import MyFiles from '../views/MyFiles';
import Profile from '../views/Profile';
import Login from '../views/Login';
import Upload from '../views/Upload';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainContext} from '../contexts/MainContext';
import Modify from '../views/Modify';
import {Feather} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {FontAwesome5} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: () => {
            return null;
          },
          headerTitle: () => (
            <Image
              source={require('../assets/logo.png')}
              style={{width: 155, height: 32, size: 50}}
              alt="logo"
            />
          ),
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="home"
              size={focused ? '28' : '24'}
              color={focused ? 'black' : 'gray'}
            />
          ),
          headerLeft: () => <Feather name="menu" size={24} color="black" />,
          headerLeftContainerStyle: {paddingLeft: 10},
          headerRight: () => (
            <AntDesign
              name="search1"
              size={24}
              color="black"
              onPress={() => {
                navigation.navigate('Search');
              }}
            />
          ),
          headerRightContainerStyle: {paddingRight: 10},
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="pluscircleo"
              size={focused ? '28' : '24'}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="user"
              size={focused ? '28' : '24'}
              color={focused ? 'black' : 'gray'}
            />
          ),
          headerRight: () => (
            <FontAwesome5
              name="sign-out-alt"
              size={24}
              color="black"
              onPress={async () => {
                console.log('Logging out!');
                setUser({});
                setIsLoggedIn(false);
                try {
                  await AsyncStorage.clear();
                } catch (e) {
                  console.log('Clearning async storage failed', e);
                }
              }}
            />
          ),
          headerRightContainerStyle: {paddingRight: 10},
        }}
      />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Single" component={Single} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="MyFiles" component={MyFiles} />
          <Stack.Screen name="Modify" component={Modify} />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        ></Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

TabScreen.propTypes = {
  navigation: PropTypes.object,
};

export default Navigator;
