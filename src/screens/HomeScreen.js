import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import Mybutton from './components/Mybutton';
import Mytext from './components/Mytext';

import { openDatabase } from 'react-native-sqlite-storage';
import { COLORS, FONTS, SIZES } from '../constants/theme';

var db = openDatabase({ name: 'fiance.db' });

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    // Create and insert data into CATEGORY table
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='CATEGORY'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS CATEGORY', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS CATEGORY( id INTEGER PRIMARY KEY AUTOINCREMENT, name text NOT NULL UNIQUE);',
              []
            );
            txn.executeSql(
              'INSERT INTO CATEGORY(name) VALUES (?), (?), (?), (?);',
              ['Giáo dục', 'Sức khỏe', 'Ăn uống', 'Mua sắm']
            );
          }
        }
      );
    });
  }, []);

  const transactionType = [
    {
      id: 1,
      name: 'Chi tiêu'
    },
    {
      id: 2,
      name: 'Thu nhập'
    }
  ]

  return (
    <SafeAreaView style={{
      paddingHorizontal: 20,
      paddingVertical: 27,
      alignItems: 'center',
      backgroundColor: COLORS.white,
      flex: 1,
    }}>
      <View style={{
        ...styles.container,
        ...styles.shadow,
        backgroundColor: COLORS.white,
        height: 250,
      }}>
        <View>
          <Text style={{ ...FONTS.body3, color: COLORS.darkgray }}>Số dư</Text>
          <Text style={{ ...FONTS.h1, color: COLORS.primary }}>100.000.000 đ</Text>
          <FlatList
            data={transactionType}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    height: 40,
                    paddingHorizontal: SIZES.radius,
                    borderRadius: 10,
                  }} >
                  {/* Name/Category */}
                  <View View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 5
                      }}
                    />
                    <Text style={{ ...FONTS.body3, color: COLORS.darkgray }}>{item.name}</Text>
                  </View>
                  {/* Expenses */}
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={{ ...FONTS.h3 }}>1000</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          keyExtractor={item => item.id}
          />
        </View>
      </View >
      <Mybutton
        title="View All"
        customClick={() => navigation.navigate('ViewAll')}
      />
      <View style={{ padding: SIZES.padding }}>
        <Text>Hello</Text>
      </View>
    </SafeAreaView >
  );
};


const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  container: {
    borderRadius: 40,
    padding: 22,
    width: '100%'
  },

})


export default HomeScreen;