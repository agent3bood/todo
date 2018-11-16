import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
// import { Constants, SQLite } from 'expo'
import rootReducer from './src/reducers'
import App from './src'
import { store, persistor } from "./src/store/configureStore";



const Index = ()=>{
  return(
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </Provider>
  )
}

export default Index