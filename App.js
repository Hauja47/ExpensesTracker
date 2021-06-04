import 'react-native-gesture-handler';

import * as React from 'react';
// import { Button, View, Text } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux';
import { store } from './src/redux/store';

import {
  HomeScreen,
  TransactionDetail,
  AddTransaction,
  AddCategory
} from './src/screens/';

const Stack = createStackNavigator();

var db = openDatabase({ name: 'fiance.db' });

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
          />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransaction}
          />
          <Stack.Screen
            name="AddCategory"
            component={AddCategory}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;