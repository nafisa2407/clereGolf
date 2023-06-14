import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Tabs/Home';
import AddMarker from './Tabs/AddMarker';
const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                source={require('../images/home.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? '#00B0FF' : null,
                }}
              />
            );
          },
          tabBarLabel: ({focused, color, size}) => {
            return (
              <Text
                style={{fontSize: 12.6, color: focused ? '#00B0FF' : '#000'}}>
                Home
              </Text>
            );
          },
        }}
      />

      <Tab.Screen
        name="Add Markers"
        component={AddMarker}
        options={{
          title: 'AddMarker',
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                source={require('../images/marker.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? '#00B0FF' : '#000',
                }}
              />
            );
          },
          tabBarLabel: ({focused, color, size}) => {
            return (
              <Text
                style={{fontSize: 12.6, color: focused ? '#00B0FF' : '#000'}}>
                AddMarker
              </Text>
            );
          },
        }}
      />

      
    </Tab.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({});
