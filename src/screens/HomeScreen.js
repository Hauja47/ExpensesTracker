import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { openDatabase } from 'react-native-sqlite-storage';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { down_arrow, up_arrow } from '../constants/icons';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native'
import NumberFormat from 'react-number-format';

import { getCategories } from '../redux/actions/categoriesAction';
import { getTransactions } from '../redux/actions/transactionsAction'

import Mybutton from './components/Mybutton';

const { DateTime } = require("luxon");
const db = openDatabase({ name: 'fiance.db' });

const HomeScreen = ({ navigation }) => {

  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [categoriesItem, setCategoriesItem] = useState([]);
  const [transactionItem, setTransactionItem] = useState([]);

  const { categories } = useSelector(state => state.categoriesReducer);
  const { transactions } = useSelector(state => state.transactionsReducer);
  const dispatch = useDispatch();

  const fetchCategories = () => dispatch(getCategories());
  const fetchTransactions = () => dispatch(getTransactions());

  const transactionType = [
    {
      id: 1,
      name: 'Chi tiêu',
      color: COLORS.red,
      icon: down_arrow
    },
    {
      id: 2,
      name: 'Thu nhập',
      color: COLORS.darkgreen,
      icon: up_arrow
    }
  ]

  const isFocus = useIsFocused()

  function convertDate(date) {
    const converDate = DateTime.fromSeconds(Number(date))
    return converDate.toISODate();
  }

  useEffect(() => {
    fetchCategories();
    createTRANSACDATE();
    fetchTransactions();
  }, []);

  const createTRANSACDATE = () => {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='TRANSACDATE'",
        [],
        function (tx, res) {
          // console.log('TRANSACDATE\'s item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'DROP TABLE IF EXISTS TRANSACDATE',
              [],
              () => { },
              (err) => { console.log(err.message) }
            );

            txn.executeSql(
              'CREATE TABLE TRANSACDATE (id INTEGER PRIMARY KEY AUTOINCREMENT, date INTERGER UNIQUE);',
              [],
              () => { },
              (err) => { console.log(err.message) }
            );

            txn.executeSql(
              'INSERT INTO TRANSACDATE(date) VALUES(?), (?), (?), (?), (?);',
              [
                1621555200,
                1629331200,
                1634256000,
                1634342400,
                1635120000
              ],
              () => { },
              (err) => { console.log(err.message) }
            );
          }
        }
      )
    })
  }

  const renderMonthYearPicker = () => {
    return (
      <View style={{ flexDirection: 'row', marginLeft: 10 }}>
        <Picker
          style={{ width: 70, marginTop: 25 }}
          selectedValue={selectedMonth}
          onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}>
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
          <Picker.Item label="6" value="6" />
          <Picker.Item label="7" value="7" />
          <Picker.Item label="8" value="8" />
          <Picker.Item label="9" value="9" />
          <Picker.Item label="10" value="10" />
          <Picker.Item label="11" value="11" />
          <Picker.Item label="12" value="12" />
        </Picker>
        <Picker
          style={{ width: 100, marginTop: 25 }}
          selectedValue={selectedMonth}
          onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}>
          <Picker.Item label="2017" value="1" />
          <Picker.Item label="2018" value="2" />
          <Picker.Item label="2019" value="3" />
          <Picker.Item label="2020" value="4" />
        </Picker>
      </View>
    )
  }

  const renderTransactionType = () => {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 40,
          marginLeft: 20,
          marginTop: 2,
          borderRadius: 22,
          paddingHorizontal: SIZES.base,
          backgroundColor: (selectedTransactionType && selectedTransactionType.name == item.name) ? item.color : COLORS.yellow
        }}
        onPress={() => {
          if (selectedTransactionType === null) {
            setSelectedTransactionType(item)
            return;
          }
          setSelectedTransactionType((item.name == selectedTransactionType.name) ? { color: COLORS.yellow } : item)
        }}
      >
        {/* Name/Category */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={item.icon}
            style={{
              width: 17,
              height: 17,
              tintColor: (selectedTransactionType && selectedTransactionType.name == item.name) ? COLORS.white : item.color,
            }}
          />
          <Text style={{
            marginLeft: SIZES.base,
            ...FONTS.h3,
            color: (selectedTransactionType && selectedTransactionType.name == item.name) ? COLORS.white : COLORS.primary
          }}>{item.name}</Text>
        </View>

        {/* Expenses */}
        <NumberFormat
          value={'1000'}
          displayType={'text'}
          thousandSeparator={true}
          suffix='đ'
          renderText={formattedValue =>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{
                ...FONTS.h3,
                color: (selectedTransactionType && selectedTransactionType.name == item.name) ? COLORS.white : COLORS.primary
              }}>{formattedValue}</Text>
            </View>
          }
        />
      </TouchableOpacity>
    )

    return (
      <FlatList
        data={transactionType}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    )
  }

  const renderCategoryListItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          margin: 5,
          marginLeft: 1,
          paddingVertical: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          borderRadius: 5,
          backgroundColor: COLORS.white,
          ...styles.shadow,
        }}
      >
        <Text style={{ color: COLORS.primary, ...FONTS.h4 }}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  const renderCategoryList = () => {
    return (
      <FlatList
        data={categories}
        renderItem={renderCategoryListItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    )
  }

  const renderTransactionInfo = () => {

    const renderTransactionInfoItemData = ({ item }) => {
      return (
        <View style={{
          padding: 10
        }}>
          <TouchableOpacity style={{
            flexDirection: 'row'
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ ...FONTS.h3, color: COLORS.black }}>{item.name}</Text>
              <Text style={{ ...FONTS.body3, color: COLORS.darkgray }} ellipsizeMode='clip' numberOfLines={1}>{item.description}</Text>
            </View>
            <View style={{
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              <NumberFormat
                value={item.amount}
                displayType={'text'}
                thousandSeparator={true}
                suffix='đ'
                renderText={formattedValue =>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: (item.type == 'expense') ? COLORS.red : COLORS.darkgreen,
                    }}
                    numberOfLines={1}>{formattedValue}
                  </Text>
                }
              />
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    const renderTransactionInfoItem = ({ item }) => {
      return (
        <View style={{
          flex: 1,
          flexDirection: 'row',
          elevation: 2,
          borderRadius: 20
        }}>
          <View style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
            alignItems: 'center',
          }}
          >
            <Text style={{ ...FONTS.h4, color: COLORS.darkgray }}>Ngày</Text>
            <Text style={{ fontSize: 35, color: COLORS.blue }}>{convertDate(item.date).split('-')[2]}</Text>
          </View>
          <View style={{
            width: 0.5,
            marginTop: 2,
            backgroundColor: '#c8c7cc',
            height: '100%'
          }} />
          <View style={{
            flex: 1,
            justifyContent: 'center',
          }}>
            <FlatList
              data={item.data}
              keyExtractor={item => item.id}
              renderItem={renderTransactionInfoItemData}
              ItemSeparatorComponent={() => (
                <View style={{
                  padding: 0.5,
                  marginTop: 2,
                  backgroundColor: '#c8c7cc',
                  marginVertical: 2,
                }} />
              )}
            />
          </View>
          <View>

          </View>
        </View>
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{
            paddingBottom: 10
          }}
          showsVerticalScrollIndicator={false}
          data={transactions.sort()}
          keyExtractor={item => item.date}
          renderItem={renderTransactionInfoItem}
          ItemSeparatorComponent={() => (<View style={{ padding: 5 }} />)}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={{
      paddingHorizontal: 20,
      paddingVertical: 27,
      paddingBottom: 0,
      backgroundColor: COLORS.white,
      flex: 1
    }}>
      <View style={{
        ...styles.container,
        ...styles.shadow,
        backgroundColor: COLORS.yellow,
        height: 250,
      }}>
        <View>
          <Text style={{ ...FONTS.body2, color: COLORS.darkgray }}>Số dư</Text>
          <Text style={{ ...FONTS.h1, fontSize: 35, color: COLORS.primary, marginTop: 5 }}>100.000.000 đ</Text>
        </View>
        <View style={{ position: 'absolute', bottom: 10, width: '105%' }}>
          {renderMonthYearPicker()}
          {renderTransactionType()}
        </View>
      </View>

      <View style={{ height: 55, marginTop: 10 }}>
        {renderCategoryList()}
      </View>

      <View style={{ flex: 1, marginTop: 10 }}>
        {renderTransactionInfo()}
      </View>

      {/* <Mybutton
        title="View All"
        customClick={() => navigation.navigate('ViewAll')}
      /> */}

      {/* <Mybutton
        title="AddTransaction"
        customClick={() => navigation.navigate('AddTransaction')}
      /> */}
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