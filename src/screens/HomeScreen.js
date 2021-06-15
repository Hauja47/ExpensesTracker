import 'react-native-gesture-handler';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated
} from 'react-native';
import { useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import MonthPicker from 'react-native-month-year-picker'
import { ButtonGroup } from 'react-native-elements';

import Chip from './components/Chip'
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { down_arrow, up_arrow, drop_down_arrow, edit, wallet } from '../constants/icons';
const transactionType = [
  {
    id: 0,
    name: 'Tất cả',
    color: COLORS.lightblue,
    type: 'all'
  },
  {
    id: 1,
    name: 'Chi tiêu',
    color: COLORS.red,
    icon: down_arrow,
    type: 'expense'
  },
  {
    id: 2,
    name: 'Thu nhập',
    color: COLORS.darkgreen,
    icon: up_arrow,
    type: 'income'
  }
]

const HomeScreen = ({ navigation }) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMYP, setshowMYP] = useState(false);
  const [date, setDate] = useState(new Date())

  const { categories } = useSelector(state => state.categoriesReducer);
  const { transactions } = useSelector(state => state.transactionsReducer);
  const { account } = useSelector(state => state.accountReducer);

  const categoryListHeightAnimationValue = useRef(new Animated.Value(0)).current;

  const renderMonthYearPicker = () => {
    const onValueChange = React.useCallback(
      (event, newDate) => {
        const selectedDate = newDate || date;

        setshowMYP(false);
        setDate(selectedDate);
      },
      [date, showMYP],
    );

    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.monthYearButton}
          onPress={() => setshowMYP(true)}
        >
          <Text style={{ ...FONTS.h3, color: COLORS.white }}>Tháng {date.getMonth() + 1} năm {date.getFullYear()}</Text>
          <Image
            source={drop_down_arrow}
            style={{ height: 15, width: 15, tintColor: COLORS.white, alignSelf: 'center', marginLeft: 5 }}
          />
        </TouchableOpacity>
        {showMYP && (
          <MonthPicker
            onChange={onValueChange}
            value={date}
            locale="vi"
            okButton="Chọn"
            cancelButton="Trở về"
            mode='shortNumber'
          />
        )}
      </View>
    )
  }

  const renderTransactionType = () => {

    const updateIndex = (index) => {

      switch (index) {
        case 0:
          setSelectedIndex(index)
          Animated.timing(categoryListHeightAnimationValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start()
          break;
        case 1:
        case 2:
          setSelectedIndex(index)
          Animated.timing(categoryListHeightAnimationValue, {
            toValue: 50,
            duration: 500,
            useNativeDriver: false,
          }).start()
          break;
        default:
          break;
      }
    }

    return (
      <ButtonGroup
        buttons={transactionType.map(type => type.name)}
        selectedIndex={selectedIndex}
        selectedButtonStyle={{ backgroundColor: transactionType.find(type => type.id === selectedIndex).color }}
        onPress={updateIndex}
      />
    )
  }

  const renderCategoryList = () => {

    const getFilteredData = () => {
      if (selectedIndex === 0) {
        return categories;
      }

      let temp = categories.filter(category => category.type === transactionType[selectedIndex].type)
      return temp;
    }

    const renderCategoryListItem = ({ item }) => {
      return (
        <Chip
          tittle={item.name}
          onPress={() => console.log('press')}
          color={transactionType[selectedIndex].color}
        />
      )
    }

    return (
      <View style={{ height: 55, marginLeft: 10 }}>
        {
          selectedIndex != 0 &&
          <FlatList
            data={getFilteredData()}
            renderItem={renderCategoryListItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        }
      </View>
    )
  }

  const renderTransactionInfo = () => {
    const totalAmountInDay = (item, transacType) => {

      let sum = item.filter((data) => {
        return data.type == transacType;
      }).map((data) => {
        return data.amount;
      }).reduce((acc, curValue) => {
        return acc + curValue;
      }, 0)

      return sum;
    }

    const handleTransactionInfoPress = (item) => {
      navigation.navigate('TransactionDetail', {
        id: item.id,
        date: item.date
      })
    }

    const renderTransactionInfoItemData = ({ item }) => {
      return (
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => handleTransactionInfoPress(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ ...FONTS.h3, color: COLORS.black }}>{item.name}</Text>
              <Text
                style={{ ...FONTS.body3, color: COLORS.darkgray }}
                ellipsizeMode='clip'
                numberOfLines={1}
              >
                {item.description}
              </Text>
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
                      color: (item.type === 'expense') ? COLORS.red : COLORS.darkgreen,
                    }}
                    numberOfLines={1}>{formattedValue}</Text>
                }
              />
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    const renderTransactionInfoItem = ({ item }) => {
      return (
        <View style={{ flex: 1, borderRadius: 15, backgroundColor: COLORS.white, elevation: 5 }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
          }}>
            <View style={styles.transactionDayContainer}>
              <Text style={{ ...FONTS.h4, color: COLORS.darkgray }}>Ngày</Text>
              <Text style={{ fontSize: 35, color: COLORS.blue }}>{(item.date).split('-')[2]}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <FlatList
                data={item.data}
                keyExtractor={item => item.id}
                renderItem={renderTransactionInfoItemData}
                ItemSeparatorComponent={() => (<View style={styles.transactionListSeperator} />)}
              />
            </View>
          </View>
          <View style={styles.detailDayContainer}>
            <View style={{ paddingHorizontal: 10, flexDirection: 'row' }}>
              <Text style={{ ...FONTS.body4, color: COLORS.darkgray }}>Thu nhập: </Text>
              <NumberFormat
                value={totalAmountInDay(item.data, 'income')}
                displayType={'text'}
                thousandSeparator={true}
                suffix='đ'
                renderText={formattedValue =>
                  <Text
                    style={{ color: COLORS.darkgreen, ...FONTS.h4 }}
                    numberOfLines={1}>
                    {formattedValue}
                  </Text>
                }
              />
            </View>
            <View style={{ paddingHorizontal: 10, flexDirection: 'row' }}>
              <Text style={{ ...FONTS.body4, color: COLORS.darkgray }}>Chi tiêu: </Text>
              <NumberFormat
                value={totalAmountInDay(item.data, 'expense')}
                displayType={'text'}
                thousandSeparator={true}
                suffix='đ'
                renderText={formattedValue =>
                  <Text
                    style={{ color: COLORS.red, ...FONTS.h4 }}
                    numberOfLines={1}
                  >
                    {formattedValue}
                  </Text>
                }
              />
            </View>
          </View>
        </View>
      )
    }

    return (
      <FlatList
        contentContainerStyle={{
          padding: 10,
        }}
        showsVerticalScrollIndicator={false}
        data={transactions}
        keyExtractor={item => item.date}
        renderItem={renderTransactionInfoItem}
        ItemSeparatorComponent={() => (<View style={{ padding: 7 }} />)}
      />
    )
  }

  return (
    <SafeAreaView style={{
      backgroundColor: COLORS.white,
      flex: 1,
    }}>
      <View style={{
        flex: 0.2,
        backgroundColor: COLORS.blue,
        flexDirection: 'row'
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          marginHorizontal: 10
        }}>
          <View style={{ flexDirection: 'row' }}>
            {/* <Image
              source={wallet}
              style={styles.icon}
            /> */}
            <Text
              style={{
                fontSize: 20,
                color: COLORS.white,
                alignSelf: 'center',
              }}
            >
              Số dư
            </Text>
          </View>
          <NumberFormat
            value={account.amount}
            displayType={'text'}
            thousandSeparator={true}
            suffix='đ'
            renderText={formattedValue =>
              <Text
                style={{
                  fontSize: 35,
                  color: (account.amount >= 0) ? COLORS.green : COLORS.red,
                }}
              >
                {formattedValue}
              </Text>
            }
          />
        </View>
        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10
        }}>
          <Image
            source={edit}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.monthYearContainer}>
        <Text style={{ ...FONTS.body2, alignSelf: 'center' }}>Thời gian:</Text>
        {renderMonthYearPicker()}
      </View>

      {renderTransactionType()}

      <Animated.View style={{ height: categoryListHeightAnimationValue, marginTop: 0 }}>
        {renderCategoryList()}
      </Animated.View>

      <View style={{ flex: 1 }}>
        {renderTransactionInfo()}
      </View>

      <TouchableOpacity
        style={styles.addTransactionButton}
        onPress={() => navigation.navigate('AddTransaction')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  addTransactionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    backgroundColor: COLORS.blue,
    bottom: 20,
    right: 20
  },
  detailDayContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    paddingHorizontal: 2,
    paddingVertical: 7,
    borderTopWidth: 0.5,
    borderColor: '#c8c7cc',
  },
  transactionListSeperator: {
    padding: 0.5,
    marginTop: 2,
    backgroundColor: '#c8c7cc',
    marginVertical: 2,
  },
  transactionDayContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderColor: '#c8c7cc',
  },
  monthYearButton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
    borderRadius: 25,
    backgroundColor: COLORS.blue
  },
  icon: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    tintColor: COLORS.white
  },
  monthYearContainer: {
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default HomeScreen;