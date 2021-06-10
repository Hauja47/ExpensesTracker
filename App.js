import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, getTransactions } from './src/redux/actions'

import { store } from './src/redux/store';
import {
  HomeScreen,
  TransactionDetail,
  AddTransaction,
  AddCategory,
  SplashScreen
} from './src/screens/';

const Stack = createStackNavigator();
const AppStack = createStackNavigator();

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const App = () => {

  const dispatch = useDispatch();
  const { isCategoriesLoaded } = useSelector(state => state.categoriesReducer)
  const { isTransactionsLoaded } = useSelector(state => state.transactionsReducer)

  React.useEffect(() => {
    dispatch(getCategories());
    dispatch(getTransactions());
  }, [])

  return (
    <NavigationContainer>
      {(!(isCategoriesLoaded && isTransactionsLoaded)) ? (
        <Stack.Navigator
          initialRouteName='SplashScreen'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
          />
        </Stack.Navigator>
      ) : (
        <AppStack.Navigator
          initialRouteName='HomeScreen'
          screenOptions={{ headerShown: false }}
        >
          <AppStack.Screen
            name="HomeScreen"
            component={HomeScreen}
          />
          <AppStack.Screen
            name="TransactionDetail"
            component={TransactionDetail}
          />
          <AppStack.Screen
            name="AddTransaction"
            component={AddTransaction}
          />
          <AppStack.Screen
            name="AddCategory"
            component={AddCategory}
          />
        </AppStack.Navigator>
      )}
    </NavigationContainer>
  )
}

export default AppWrapper;