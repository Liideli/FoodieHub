import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
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
import ChangePassword from '../views/ChangePassword';

// NativeBase Components
import {Box} from 'native-base';

// Defines navigators
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Creates the drawer navigator
const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        swipeEnabled: false,
        drawerStyle: {backgroundColor: '#FFC56D'},
        headerShown: false,
        // Adds custom drawercontent to the drawer menu
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Stack" component={StackScreen} />
    </Drawer.Navigator>
  );
};

// Customized drawercontent
const DrawerContent = (props) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  return (
    <DrawerContentScrollView {...props}>
      {/* Adds the user's avatar and username to the drawer menu */}
      <Box borderBottomWidth={0.5} borderColor="white" marginBottom={1}>
        <AvatarName />
      </Box>
      {/* Custom drawer items with navigation and icons */}
      <DrawerItem
        label="Home"
        labelStyle={{
          marginLeft: -25,
          fontFamily: 'OpenSansRegular',
          fontSize: 16,
        }}
        onPress={() => props.navigation.navigate('Home')}
        icon={() => <AntDesign name="home" size={24} />}
      />
      <DrawerItem
        label="Profile"
        labelStyle={{
          marginLeft: -25,
          fontFamily: 'OpenSansRegular',
          fontSize: 16,
        }}
        onPress={() => props.navigation.navigate('Profile')}
        icon={() => <AntDesign name="user" size={24} />}
      />
      <DrawerItem
        label="Search"
        labelStyle={{
          marginLeft: -25,
          fontFamily: 'OpenSansRegular',
          fontSize: 16,
        }}
        onPress={() => props.navigation.navigate('Search')}
        icon={() => <AntDesign name="search1" size={24} />}
      />
      <DrawerItem
        label="Add a new recipe"
        labelStyle={{
          marginLeft: -25,
          fontFamily: 'OpenSansRegular',
          fontSize: 16,
        }}
        onPress={() => props.navigation.navigate('Upload')}
        icon={() => <AntDesign name="pluscircleo" size={24} />}
      />
      <DrawerItem
        label="Change password"
        labelStyle={{
          marginLeft: -25,
          fontFamily: 'OpenSansRegular',
          fontSize: 16,
        }}
        onPress={() => props.navigation.navigate('ChangePassword')}
        icon={() => <AntDesign name="setting" size={24} />}
      />
      <DrawerItem
        label="Sign out"
        labelStyle={{
          marginLeft: -25,
          fontFamily: 'OpenSansRegular',
          fontSize: 16,
        }}
        icon={() => <AntDesign name="logout" size={24} />}
        onPress={async () => {
          props.navigation.closeDrawer();
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
    </DrawerContentScrollView>
  );
};

const TabScreen = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: 'FoodieHub',
          headerTitleStyle: {fontFamily: 'Lobster', fontSize: 24},
          tabBarLabel: () => {
            return null;
          },
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
          title: 'New recipe',
          headerTitleStyle: {fontFamily: 'Lobster', fontSize: 24},
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
          headerTitleStyle: {fontFamily: 'Lobster', fontSize: 24},
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
            <AntDesign
              name="logout"
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
          <Stack.Screen
            name="Single"
            component={Single}
            options={{
              headerBackTitleVisible: false,
              title: 'Recipe',
              headerTitleStyle: {fontFamily: 'Lobster', fontSize: 24},
            }}
          />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{
              title: 'Change password',
              headerTitleStyle: {fontFamily: 'Lobster', fontSize: 24},
            }}
          />
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

// Uses drawer screen as the base navigation and nests stack nav inside drawer nav and tab nav inside stack nav
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
