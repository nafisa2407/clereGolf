import {configureStore} from '@reduxjs/toolkit';
import MarkerReducer from './MarkerSlice';


export const mystore = configureStore({
    reducer: {
        markerlist: MarkerReducer,//You can add multiple reducers here
      },
    
});


