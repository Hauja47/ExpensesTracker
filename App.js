import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector, useDispatch } from 'react-redux';
import { Provider } from 'react-redux';

import { store } from './src/redux/store';
import {
  HomeScreen,
  TransactionDetail,
  AddTransaction,
  AddCategory,
  SplashScreen
} from './src/screens/';
import { getCategories, getTransactions } from './src/redux/actions'

const Stack = createStackNavigator();

const AppWapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const App = () => {

  const dispatch = useDispatch();
  const { isTransactionsLoaded } = useSelector(state => state.transactionsReducer)
  const { isCategoriesLoaded } = useSelector(state => state.categoriesReducer)

  React.useEffect(() => {
    dispatch(getTransactions());
    dispatch(getCategories());
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {(!(isTransactionsLoaded && isCategoriesLoaded)) ?
          (
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
            />
          ) : (
            <>
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
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppWapper;