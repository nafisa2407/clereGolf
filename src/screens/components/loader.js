import {StyleSheet, Text, View, Modal} from 'react-native';
import React from 'react';
import {scale} from '../../utils/ResponsiveSize';
import {ActivityIndicator} from 'react-native';

const Loader = ({visible}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.loaderView}>
        <View style={styles.mainView}>
          <ActivityIndicator size={'large'} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loaderView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    width: scale(100),
    height: scale(100),
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
