import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {THEME_COLOR} from '../../utils/Colors';
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
  verticalScale,
} from '../../utils/ResponsiveSize';
import MapboxGL from '@rnmapbox/maps';
import AnnotationContent from '../AnnotationContent';
import {SelectList} from 'react-native-dropdown-select-list';
import {useDispatch} from 'react-redux';
import CustomButton from '../components/CustomButton';
import {addMarker} from '../../../Redux/MarkerSlice';
import {useNavigation,useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
let userId = uuid.v4();
const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showMarker, setShowMarker] = useState(false);
  const [badTitle, setBadTitle] = useState(false);
  const [badDesc, setBadDesc] = useState(false);
  const [markers, setMarkers] = useState([8.5574, 50.7891]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const myRef = useRef();
  const isFocused = useIsFocused();
  const [selected, setSelected] = React.useState('');
  const data = [
    {key: '1', value: 'Food'},
    {key: '2', value: 'office'},
    {key: '3', value: 'religion'},
    {key: '4', value: 'nature'},
  ];

 useEffect(()=>{
  setTitle('');
  setDesc('');
 },[isFocused])

 /**
  * Function validates textboxes
  * Shows error message if left blank
  * @returns boolean value
  */
  const validate = () => {
    let valid = true;
    if (title == '') {
      valid = false;
      setBadTitle(true);
    } else {
      setBadTitle(false);
    }
    if (desc == '') {
      valid = false;
      setBadDesc(true);
    } else {
      setBadDesc(false);
    }
    return valid;
  };


  const moveMap = newCoordinates => {
    setMarkers(newCoordinates);
    setShowMarker(true);
    myRef && myRef.current.moveTo(markers, 200);
  };


  const addLocation = () => {
    dispatch(addMarker({title, desc, type: selected, location: markers}));
    firestore()
              .collection('markers')
              .doc(userId)
              .set({
                title: title,
                desc: desc,
                location: markers,
                type: selected,
                userId: userId,
              })
              .then(res => {
                console.log('response',res);
              })
              .catch(error => {
                console.log(error);
              });
    navigation.navigate('Home');
  };

  const userLocation = userlocation => {
    setMarkers(userlocation);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.txtInput, {marginTop: verticalScale(20)}]}
        placeholder="Enter Title"
        value={title}
        onChangeText={txt => setTitle(txt)}
      />
      {badTitle && <Text style={styles.error}>{'Please Enter Title'}</Text>}
      <TextInput
        style={[styles.txtInput, {marginTop: verticalScale(20)}]}
        placeholder="Enter Description"
        value={desc}
        onChangeText={txt => setDesc(txt)}
      />
      {badDesc && (
        <Text style={styles.error}>{'Please Enter Description'}</Text>
      )}
      <SelectList
        setSelected={val => setSelected(val)}
        data={data}
        save="value"
        boxStyles={styles.optionInput}
        dropdownStyles={{marginHorizontal: 20}}
      />
      <View style={styles.signupView}>
        <MapboxGL.MapView
          style={styles.map}
          onPress={feature => moveMap(feature.geometry.coordinates)}>
          <MapboxGL.Camera
            zoomLevel={5}
            centerCoordinate={markers}
            ref={myRef}
          />
          <MapboxGL.UserLocation
            minDisplacement={1}
            visible={true}
            onUpdate={data =>
              userLocation([data.coords.longitude, data.coords.latitude])
            }></MapboxGL.UserLocation>
          <MapboxGL.MarkerView id={1} coordinate={markers}>
            <View>
              {showMarker && (
                <AnnotationContent
                  title={title}
                  desc={desc}
                  coordinate={markers}
                  customisedName={'customisedName'}
                />
              )}
            </View>
          </MapboxGL.MarkerView>
        </MapboxGL.MapView>
      </View>
      <CustomButton
        title={'Add Marker'}
        onClick={() => {
          if (validate()) {
            addLocation();
          }
        }}
      />
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
  },
  locationError: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '20%',
    zIndex: 1,
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
    width: scale(20),
    height: scale(20),
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
  optionInput: {
    width: '90%',
    height: verticalScale(50),
    alignSelf: 'center',
    marginTop: moderateScaleVertical(20),
  },
  signupView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: verticalScale(20),
    width: '90%',
    height: '50%',
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
  btncontainer: {
    width: '90%',
    height: verticalScale(50),
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: moderateScaleVertical(20),
    marginBottom: moderateScaleVertical(20),
    borderWidth: 1,
  },
  btnText: {
    color: 'white',
  },
});
