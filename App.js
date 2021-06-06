import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import { Provider } from 'react-redux';
import { store } from './src/redux/store';

import {
  HomeScreen,
  TransactionDetail,
  AddTransaction,
  AddCategory,
  SplashScreen
} from './src/screens/';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
          />
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