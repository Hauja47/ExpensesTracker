import 'react-native-gesture-handler';
import React from 'react';
import {
  View,
  StyleSheet,
  Image
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { detail, category } from '../constants/icons'
import TransactionsTab from './components/TransactionsTab'
import CategoriesTab from './components/CategoriesTab'
import { COLORS } from '../constants/theme';

const Tab = createMaterialTopTabNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <Tab.Navigator
      style={{ backgroundColor: 'white' }}
      tabBarPosition='bottom'
      tabBarOptions={{
        style: {
          elevation: 3,
          backgroundColor: COLORS.lightGray2,
          borderRadius: 25,
          height: 50,
          justifyContent: 'center',
          margin: 10,
          ...styles.shadow,
        },
        showIcon: true,
        indicatorStyle: {
          backgroundColor: COLORS.blue,
          height: '100%',
          borderRadius: 25,
          elevation: 7
        },
        activeTintColor: COLORS.white,
        inactiveTintColor: 'gray',
        tabStyle: {
          flexDirection: 'row',
          justifyContent: 'center',
        }
      }}
    >
      <Tab.Screen
        name='Chi tiêu'
        component={TransactionsTab}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={detail}
                style={{ ...styles.icon, tintColor: color }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='Danh mục'
        component={CategoriesTab}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={category}
                style={{ ...styles.icon, tintColor: color }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
};

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  }
})

export default HomeScreen;