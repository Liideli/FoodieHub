import React, {useContext} from 'react';
import {Image} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import Home from '../views/Home';
import Single from '../views/Single';
import Search from '../views/Search';
import Profile from '../views/Profile';
import Login from '../views/Login';
import Upload from '../views/Upload';
import AvatarName from '../components/UserAvatar';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainContext} from '../contexts/MainContext';
import {Feather} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {FontAwesome5} from '@expo/vector-icons';
import {Box} from 'native-base';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        swipeEnabled: false,
        drawerStyle: {backgroundColor: '#FFC56D'},
        drawerLabelStyle: {marginLeft: -25},
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={StackScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <FontAwesome5 name="home" size={22} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: () => (
            <FontAwesome5 name="user-alt" size={22} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="Add a new recipe"
        component={Upload}
        options={{
          drawerIcon: () => (
            <FontAwesome5 name="upload" size={22} color="black" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const DrawerContent = (props, {navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  return (
    <DrawerContentScrollView {...props}>
      <Box borderBottomWidth={0.5} borderColor="white" marginBottom={1}>
        <AvatarName />
      </Box>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign out"
        labelStyle={{marginLeft: -25}}
        icon={() => (
          <FontAwesome5 name="sign-out-alt" size={22} color="black" />
        )}
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
      ></DrawerItem>
    </DrawerContentScrollView>
  );
};

const TabScreen = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
      }}
    >
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
              size={focused ? 28 : 24}
              color={focused ? 'black' : 'gray'}
            />
          ),
          headerLeft: () => (
            <Feather
              name="menu"
              size={24}
              color="black"
              onPress={() => navigation.openDrawer()}
            />
          ),
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
          headerLeft: () => (
            <Feather
              name="menu"
              size={24}
              color="black"
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerLeftContainerStyle: {paddingLeft: 10},
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="pluscircleo"
              size={focused ? 28 : 24}
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
              size={focused ? 28 : 24}
              color={focused ? 'black' : 'gray'}
            />
          ),
          headerLeft: () => (
            <Feather
              name="menu"
              size={24}
              color="black"
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerLeftContainerStyle: {paddingLeft: 10},
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
      <DrawerScreen />
    </NavigationContainer>
  );
};

TabScreen.propTypes = {
  navigation: PropTypes.object,
};

DrawerContent.propTypes = {
  navigation: PropTypes.object,
};

export default Navigator;
