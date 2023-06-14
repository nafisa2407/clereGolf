import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {moderateScaleVertical, verticalScale} from '../../utils/ResponsiveSize';
import {THEME_COLOR} from '../../utils/Colors';

const CustomButton = ({onClick, title}) => {

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onClick();
      }}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: verticalScale(50),
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: moderateScaleVertical(20),
    marginBottom:moderateScaleVertical(20),
    borderWidth:1
  },
  btnText: {
    color: 'white',
  },
});
