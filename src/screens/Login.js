import {View, Text, StyleSheet, Image, TextInput, Alert} from 'react-native';
import React, {useState} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
  verticalScale,
} from '../utils/ResponsiveSize';
import CustomButton from '../screens/components/CustomButton';
import firestore from '@react-native-firebase/firestore';
import Loader from '../screens/components/loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [email, setEamil] = useState('');

  const [pass, setPass] = useState('');

  const [badEmail, setBadEmail] = useState(false);

  const [badPass, setBadPass] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const validate = () => {
    let valid = true;

    if (email == '') {
      valid = false;
      setBadEmail(true);
    } else {
      setBadEmail(false);
    }

    if (pass == '') {
      valid = false;
      setBadPass(true);
    } else {
      setBadPass(false);
    }

    return valid;
  };
  const signin = () => {
    // step 1 check user exists or not
    // if not then redirect to sign up page
    setLoaderVisible(true);
    firestore()
      .collection('users')
      // Filter results
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        setLoaderVisible(false);
        if (querySnapshot.docs.length > 0) {
          if (pass === querySnapshot.docs[0]._data.pass) {
            goToNextScreen(querySnapshot.docs[0]._data);
          } else {
            Alert.alert('Wrong Password');
          }
        } else {
          Alert.alert('No User Found with this email id');
        }
      })
      .catch(error => {
        setLoaderVisible(false);
      });
  };
  const goToNextScreen = async data => {
    await AsyncStorage.setItem('NAME', data.name);
    await AsyncStorage.setItem('EMAIL', data.email);
    await AsyncStorage.setItem('MOBILE', data.mobile);
    await AsyncStorage.setItem('USER_ID', data.userId);
    await AsyncStorage.setItem('IS_USER_LOGGED_IN', 'yes');
    setEamil('');
    setPass('');
    navigation.navigate('Main');
  };
  return (
    <View style={styles.container}>
      <View style={styles.logoView}>
        <Image
          source={require('../images/login.png')}
          style={styles.logoViewImg}
        />
      </View>
      <TextInput
        style={[styles.txtInput, {marginTop: verticalScale(50)}]}
        placeholder="Enter Email"
        value={email}
        onChangeText={txt => setEamil(txt)}
      />
      {badEmail && <Text style={styles.error}>{'Please Enter Email'}</Text>}
      <TextInput
        style={[styles.txtInput, {marginTop: verticalScale(20)}]}
        placeholder="Enter Password"
        value={pass}
        secureTextEntry={true}
        onChangeText={txt => setPass(txt)}
      />
      {badPass && <Text style={styles.error}>{'Please Enter Password'}</Text>}
      <CustomButton
        onClick={() => {
          if (validate()) {
            signin();
          }
        }}
        title={'Login'}
      />
      <View style={styles.signupView}>
        <Text style={styles.dont}>{"Don't have account?"}</Text>
        <Text
          style={styles.signup}
          onPress={() => {
            navigation.navigate('Signup');
          }}>
          {'Sign up'}
        </Text>
      </View>
      <Loader visible={loaderVisible} />
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoView: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: verticalScale(120),
  },
  logoViewText: {
    fontSize: textScale(24),
    fontWeight: '700',
    color: THEME_COLOR,
  },
  logoViewImg: {
    width: scale(200),
    height: scale(200),
    marginLeft: 3,
  },
  txtInput: {
    width: '90%',
    height: verticalScale(50),
    alignSelf: 'center',
    paddingLeft: scale(20),
    borderWidth: 0.5,
    borderRadius: 5,
    fontSize: textScale(14),
  },
  signupView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: verticalScale(50),
  },
  signup: {
    color: THEME_COLOR,
    fontWeight: '500',
    marginLeft: moderateScale(10),
    fontSize: textScale(20),
  },
  dont: {
    color: '#000',
    fontSize: textScale(20),
  },
  error: {
    color: 'red',
    marginLeft: moderateScale(20),
    marginTop: moderateScaleVertical(4),
  },
});
