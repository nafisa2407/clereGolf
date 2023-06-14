import {View, Text} from 'react-native';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {Provider} from 'react-redux';
import {mystore} from './Redux/store';
const App = () => {
  return (
    <Provider store={mystore}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
