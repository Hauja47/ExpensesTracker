// Example: Example of SQLite Database in React Native
// https://aboutreact.com/example-of-sqlite-database-in-react-native
import 'react-native-gesture-handler';

import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import ViewAllUser from './src/screens/ViewAllUser';

const Stack = createStackNavigator();

var db = openDatabase({ name: 'fiance.db' });

const App = () => {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;