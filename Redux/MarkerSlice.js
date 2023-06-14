import {createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
let userId = uuid.v4();
export const MarkerSlice = createSlice({
  name: 'markerList',
  initialState: {
    data: [],
  },
  reducers: {
    //Add multiple actions into it
    addMarker(state, action) {
      console.log('delete state.data',state.data)
      console.log('delete action.payload',action.payload)

      state.data.push(action.payload);
      firestore()
              .collection('markers')
              .doc(userId)
              .set({
                title: action.payload.title,
                desc: action.payload.desc,
                location: action.payload.location,
                type: action.payload.type,
                userId: userId,
              })
              .then(res => {
                console.log('response',res);
              })
              .catch(error => {
                console.log(error);
              });
    },
    deleteMarker(state, action) {
      console.log('delete state.data',state.data)
      let tempData = state.data;
      let newData = tempData.filter((item, index) => {
        return index !== action.payload;
      });

      state.data = newData;
    },
    editMarker(state, action) {
      console.log('action.payload.title',action.payload)
      console.log('state.data',action.payload)
      let tempData = state.data;
      tempData.map((item, index) => {
        if (action.payload.index == index) {

          item.title = action.payload.title;
          item.desc = action.payload.desc;
          item.location = action.payload.location;
          item.type = action.payload.type;
        }
      });
      state.data = tempData;
    },
  },
});

export const {addMarker, deleteMarker, editMarker} = MarkerSlice.actions;
export default MarkerSlice.reducer;
