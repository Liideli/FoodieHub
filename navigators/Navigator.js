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
import {Icon} from '@rneui/base';
import {Feather} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {Box} from 'native-base';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        swipeEnabled: false,
        drawerStyle: {backgroundColor: '#FFC56D'},
        headerShown: false,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Stack" component={StackScreen} />
    </Drawer.Navigator>
  );
};

const DrawerContent = (props) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  return (
    <DrawerContentScrollView {...props}>
      <Box borderBottomWidth={0.5} borderColor="white" marginBottom={1}>
        <AvatarName />
      </Box>
      <DrawerItem
        label="Home"
        labelStyle={{marginLeft: -25}}
        onPress={() => props.navigation.navigate('Home')}
        icon={({focused}) => (
          <AntDesign
            name="home"
            size={focused ? 28 : 24}
            color={focused ? 'black' : 'gray'}
          />
        )}
      />
      <DrawerItem
        label="Profile"
        labelStyle={{marginLeft: -25}}
        onPress={() => props.navigation.navigate('Profile')}
        icon={({focused}) => (
          <AntDesign
            name="user"
            size={focused ? 28 : 24}
            color={focused ? 'black' : 'gray'}
          />
        )}
      />
      <DrawerItem
        label="Add a new recipe"
        labelStyle={{marginLeft: -25}}
        onPress={() => props.navigation.navigate('Upload')}
        icon={({focused}) => (
          <AntDesign
            name="pluscircleo"
            size={focused ? 28 : 24}
            color={focused ? 'black' : 'gray'}
          />
        )}
      />
      <DrawerItem
        label="Sign out"
        labelStyle={{marginLeft: -25}}
        icon={({focused}) => (
          <AntDesign
            name="logout"
            size={focused ? 28 : 24}
            color={focused ? 'black' : 'gray'}
          />
        )}
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
      ></DrawerItem>
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
          tabBarIcon: (color) => <Icon name="home" color={color} />,
          title: 'FoodieHub',
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
          tabBarIcon: (color) => <Icon name="cloud-upload" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: (color) => <Icon name="person" color={color} />,
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
