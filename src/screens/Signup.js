import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    Alert,
  } from 'react-native';
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
  import uuid from 'react-native-uuid';
  import Loader from '../screens/components/loader';
  const Signup = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEamil] = useState('');
    const [mobile, setMobile] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [badName, setBadName] = useState(false);
    const [badEmail, setBadEmail] = useState(false);
    const [badPhone, setBadPhone] = useState(false);
    const [badPass, setBadPass] = useState(false);
    const [badConfirmPass, setBadConfirmPass] = useState(false);
    const [loaderVisible, setLoaderVisible] = useState(false);
  
    const registerUser = () => {
      // condition 1=> check existing user - redirect to login page
      setLoaderVisible(true);
      let userId = uuid.v4();
  
      firestore()
        .collection('users')
        // Filter results
        .where('name', '==', email)
        .get()
        .then(querySnapshot => {
          /* ... */
          if (querySnapshot.docs.length == 0) {
            // condition 2=> create account if not created
            setLoaderVisible(false);
            firestore()
              .collection('users')
              .doc(userId)
              .set({
                name: name,
                email: email,
                mobile: mobile,
                pass: pass,
                userId: userId,
              })
              .then(res => {
                navigation.goBack();
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            setLoaderVisible(false);
            Alert.alert('user already exists');
          }
        })
        .catch(error => {
          setLoaderVisible(false);
          console.log('error' + error);
        });
    };
  
    const validate = () => {
      let valid = true;
      if (name == '') {
        valid = false;
        setBadName(true);
      } else {
        setBadName(false);
      }
      if (email == '') {
        valid = false;
        setBadEmail(true);
      } else {
        setBadEmail(false);
      }
      if (mobile == '') {
        valid = false;
        setBadPhone(true);
      } else {
        setBadPhone(false);
      }
      if (pass == '') {
        valid = false;
        setBadPass(true);
      } else {
        setBadPass(false);
      }
      if (confirmPass == '') {
        valid = false;
        setBadConfirmPass(true);
      } else {
        setConfirmPass(false);
      }
      return valid;
    };
  
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.logoView}>
            <Image
              source={require('../images/login.png')}
              style={styles.logoViewImg}
            />
          </View>
          <TextInput
            style={[styles.txtInput, {marginTop: verticalScale(50)}]}
            placeholder="Enter Name"
            value={name}
            onChangeText={txt => setName(txt)}
          />
          {badName && <Text style={styles.error}>{'Please Enter Name'}</Text>}
  
          <TextInput
            style={[styles.txtInput, {marginTop: verticalScale(20)}]}
            placeholder="Enter Email"
            value={email}
            onChangeText={txt => setEamil(txt)}
          />
          {badEmail && <Text style={styles.error}>{'Please Enter Email'}</Text>}
          <TextInput
            style={[styles.txtInput, {marginTop: verticalScale(20)}]}
            placeholder="Enter Mobile No."
            value={mobile}
            keyboardType="number-pad"
            onChangeText={txt => setMobile(txt)}
          />
          {badPhone && (
            <Text style={styles.error}>{'Please Enter Mobile No.'}</Text>
          )}
          <TextInput
            style={[styles.txtInput, {marginTop: verticalScale(20)}]}
            placeholder="Enter Password"
            value={pass}
            onChangeText={txt => setPass(txt)}
          />
          {badPass && <Text style={styles.error}>{'Please Enter Password'}</Text>}
          <TextInput
            style={[styles.txtInput, {marginTop: verticalScale(20)}]}
            placeholder="Enter Confirm Password"
            value={confirmPass}
            onChangeText={txt => setConfirmPass(txt)}
          />
          {badConfirmPass && (
            <Text style={styles.error}>{'Please Enter Confirm Password'}</Text>
          )}
          <CustomButton
            onClick={() => {
              if (validate()) {
                registerUser();
              }
            }}
            title={'Sign up'}
          />
          <View style={styles.loginView}>
            <Text style={styles.dont}>{'already have account?'}</Text>
            <Text
              style={styles.login}
              onPress={() => {
                navigation.goBack();
              }}>
              {'Login'}
            </Text>
          </View>
          <Loader visible={loaderVisible} />
        </View>
      </ScrollView>
    );
  };
  
  export default Signup;
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
      width: scale(100),
      height: scale(100),
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
    loginView: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: verticalScale(50),
      marginBottom: verticalScale(50),
    },
    login: {
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
  