import 'react-native-gesture-handler';

import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux';
import { store } from './src/redux/store';

import {
  HomeScreen,
  TransactionDetail,
  ViewAllUser,
  AddTransaction
} from './src/screens/';

const Stack = createStackNavigator();

var db = openDatabase({ name: 'fiance.db' });

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ViewAll"
            component={ViewAllUser}
          />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransaction}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;