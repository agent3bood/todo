import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { Constants, SQLite } from 'expo'
import rootReducer from './src/reducers'
import App from './src'

const store = createStore(rootReducer)


const Index = ()=>{
  return(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default Index