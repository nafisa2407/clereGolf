import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      checkStatus();
    }, 2000);
  }, []);

  /**
   * Function checks if user is logged in then goto main screen 
   * orelse goes to signup screen or login screen
   */
  
  const checkStatus = async () => {
    let status = await AsyncStorage.getItem('IS_USER_LOGGED_IN');
    if (status != null) {
      navigation.navigate('Main');
    } else {
      navigation.navigate('Login');
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle="dark-content" />
      <Image source={require('../images/world.png')} style={styles.logo} />
    </View>
  );
};

export default Splash;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});
