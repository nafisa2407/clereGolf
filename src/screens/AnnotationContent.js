import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {moderateScale, scale} from '../utils/ResponsiveSize';
import {useNavigation} from '@react-navigation/native';

const AnnotationContent = ({title, desc }) => {
  const navigation = useNavigation();
  const editMarker = () => {
    navigation.navigate('EditMarker', {title, desc});
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {title && <Text style={styles.text}>{title}</Text>}
        {desc && <Text>{desc}</Text>}
      </View>
      <TouchableOpacity
        onLongPress={() => {
          editMarker();
        }}>
        <Image source={require('../images/marker.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default AnnotationContent;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: moderateScale(100),
    backgroundColor: 'transparent',
    height: moderateScale(80),
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    flex: 1,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: moderateScale(5),
  },
  icon: {
    paddingTop: moderateScale(10),
    height: scale(24),
    width: scale(24),
  },
});
