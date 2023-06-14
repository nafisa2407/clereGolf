import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Splash from '../screens/Splash';
import AddMarker from '../screens/Tabs/AddMarker'
import EditMarker from '../screens/EditMarker'
import Main from '../screens/Main';
import Login from '../screens/Login';
import Signup from '../screens/Signup';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={'Splash'} component={Splash} options={{headerShown:false}}/>
        <Stack.Screen name={'Main'} component={Main} options={{headerShown:false}}/>
        <Stack.Screen name={'AddMarker'} component={AddMarker}/>
        <Stack.Screen name={'Login'} component={Login} options={{headerShown:false}}/>
        <Stack.Screen name={'Signup'} component={Signup} options={{headerShown:false}}/>
       <Stack.Screen name={'EditMarker'} component={EditMarker}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
