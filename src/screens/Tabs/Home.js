import 'react-native-gesture-handler';

import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Text,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import {useSelector} from 'react-redux';
import {mapboxToken} from '../../utils/credential';
import {moderateScale, scale, textScale} from '../../utils/ResponsiveSize';
import {useDispatch} from 'react-redux';

MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(mapboxToken);

import {deleteMarker} from '../../../Redux/MarkerSlice';
import {BLACK} from '../../utils/Colors';

const {width} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let markerlist = useSelector(state => state.markerlist.data);
  const [markerlistItem, setMarkers] = useState(markerlist);
  const _scrollView = React.useRef(null);
  const _map = React.useRef(null);

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  const [coordinates, setCoordinates] = useState([-3.162052261462179, 53.429372357705404]);
  const myRef = useRef(null);
  /**
   * First time load
   */
  useEffect(() => {
    if (!checkLocationPermission()) {
      Alert.alert('Location Access permission denied');
    }
    // getMarkers(); WIP
  }, []);

  
  // /** WIP
  //  * Get saved markers from firestore
  //  */
  // const getMarkers = () => {
  //   let tempData = [];
  //   firestore()
  //     .collection('markers')
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot._docs.forEach(documentSnapshot => {
  //         tempData.push(documentSnapshot.data());
  //       });
        
  //      // if(tempData.length!=0)  markerlist  = tempData
        
  //     });
  //     console.log('tempData',tempData)
  //       console.log('markerlist',markerlist)
  // };

  /**
   * This function is used to scroll map area as we move bottom cards
   */
  useEffect(() => {
    mapAnimation.addListener(({value}) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= markerlist.length) {
        index = markerlist.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const coordinate = markerlist[index].location;
          myRef.current.moveTo(coordinate, 200);
        }
      }, 1000);
    });
  });

  /**
   * This Animates marker size as we move bottom cards
   */
  const interpolations = markerlist.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: 'clamp',
    });

    return {scale};
  });

  const checkLocationPermission = async () => {
    const isGranted = await MapboxGL.requestAndroidLocationPermissions();
    return isGranted;
  };

  /**
   * This function is use to move to user location on click of icon on top right
   */
  const movetouserLocation = () => {
    myRef.current.moveTo(coordinates, 200);
  };

  const userLocation = userlocation => {
    setCoordinates(userlocation);
  };

  /**
   * This deletes the selected marker
   * @param {*} index
   */
  const deleteSelectedMarker = index => {
    dispatch(deleteMarker(index));
  };

  /**
   * Function edits the markers and save it in redux
   */
  const editMarker = (marker, index) => {
    navigation.navigate('EditMarker', {marker: marker, index: index});
  };

  /**
   * This function chooses and displays image  based on type selected by user
   */
  const renderImage = type => {
    let selectecImage;
    if (type == 'food') selectecImage = require('../../images/food.jpeg');
    else if (type == 'office')
      selectecImage = require('../../images/office.jpeg');
    else if (type == 'religion')
      selectecImage = require('../../images/religious.jpeg');
    else if (type == 'nature')
      selectecImage = require('../../images/nature.jpeg');
    else selectecImage = require('../../images/food.jpeg');
    return (
      <Image
        source={selectecImage}
        style={styles.cardImage}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        ref={_map}
        logoEnabled={false}
        localizeLabels={true}>
        <MapboxGL.UserLocation
          minDisplacement={1}
          visible={true}
          onUpdate={data =>
            userLocation([data.coords.longitude, data.coords.latitude])
          }></MapboxGL.UserLocation>
        <MapboxGL.Camera
          zoomLevel={5}
          animationMode={'flyTo'}
          animationDuration={1100}
          centerCoordinate={[-3.162052261462179, 53.429372357705404]}
          ref={myRef}
        />

        {markerlist &&
          markerlist.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            return (
              <MapboxGL.MarkerView key={index} coordinate={marker.location}>
                <TouchableOpacity onLongPress={() => editMarker(marker, index)}>
                  <Animated.View style={[styles.markerWrap]}>
                    <Animated.Image
                      source={require('../../images/marker.png')}
                      style={[styles.marker, scaleStyle]}
                      resizeMode="cover"
                    />
                  </Animated.View>
                </TouchableOpacity>
              </MapboxGL.MarkerView>
            );
          })}
      </MapboxGL.MapView>
      <TouchableOpacity
        style={styles.addressContainer}
        onPress={() => movetouserLocation()}>
        <Image source={require('../../images/user.png')} style={styles.icon} />
      </TouchableOpacity>
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal:
            Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          {useNativeDriver: true},
        )}>
        {markerlist.map((marker, index) => (
          <View style={styles.card} key={index}>
            {renderImage(marker.type)}
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.cardtitle}>
                {marker.title}
              </Text>
              <Text numberOfLines={1} style={styles.cardDescription}>
                {marker.desc}
              </Text>
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => {
                    editMarker(marker, index);
                  }}
                  style={[
                    styles.signIn,
                    {
                      borderColor: '#FF6347',
                      borderWidth: 1,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#FF6347',
                      },
                    ]}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    deleteSelectedMarker(index);
                  }}
                  style={[
                    styles.signIn,
                    {
                      borderColor: '#FF6347',
                      borderWidth: 1,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#FF6347',
                      },
                    ]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '20%',
    zIndex: 1,
  },
  icon: {
    paddingTop: moderateScale(10),
    height: scale(24),
    width: scale(24),
    position: 'absolute',
    zIndex: 1,
    top: 50,
    right: 10,
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    elevation: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: textScale(14),
    fontWeight: '700',
    color: BLACK,
  },
  cardDescription: {
    fontSize: textScale(12),
    fontWeight: '400',
    color: BLACK,
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signIn: {
    width: '48%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  marker: {
    width: 30,
    height: 30,
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
});
