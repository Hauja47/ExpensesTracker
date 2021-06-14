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
import { useSelector, useDispatch } from 'react-redux';
import NumberFormat from 'react-number-format';
import MonthPicker from 'react-native-month-year-picker'
import { useIsFocused } from '@react-navigation/native';

import { COLORS, FONTS, SIZES } from '../constants/theme';
import { down_arrow, up_arrow, drop_down_arrow, edit } from '../constants/icons';
import { getAccount } from '../redux/actions/accountAction';

const transactionType = [
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

  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const [selectedTransactionType, setSelectedTransactionType] = useState('all');
  const [showMYP, setshowMYP] = useState(false);
  const [date, setDate] = useState(new Date())

  const { categories } = useSelector(state => state.categoriesReducer);
  const { transactions } = useSelector(state => state.transactionsReducer);
  const { account } = useSelector(state => state.accountReducer);

  const categoryListHeightAnimationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('account:', account)
    console.log('transactions:', transactions)
  }, [isFocus])

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
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 40,
          marginTop: 2,
          borderRadius: 22,
          paddingHorizontal: SIZES.base,
          backgroundColor: (selectedTransactionType && selectedTransactionType == item.type) ? item.color : 'gold'
        }}
        onPress={() => {
          switch (selectedTransactionType) {
            case 'all':
              setSelectedTransactionType(item.type)
              Animated.timing(categoryListHeightAnimationValue, {
                toValue: 55,
                duration: 500,
                useNativeDriver: false,
              }).start()
              break;
            case item.type:
              setSelectedTransactionType('all')
              Animated.timing(categoryListHeightAnimationValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
              }).start()
              break;
            default:
              setSelectedTransactionType(item.type)
              break;
          }
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={item.icon}
            style={{
              width: 17,
              height: 17,
              tintColor: (selectedTransactionType && selectedTransactionType == item.type) ? COLORS.white : item.color,
            }}
          />
          <Text style={{
            marginLeft: SIZES.base,
            ...FONTS.h3,
            color: (selectedTransactionType && selectedTransactionType == item.type) ? COLORS.white : COLORS.primary
          }}>{item.name}</Text>
        </View>
        <NumberFormat
          value={'1000'}
          displayType={'text'}
          thousandSeparator={true}
          suffix='đ'
          renderText={formattedValue =>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{
                ...FONTS.h3,
                color: (selectedTransactionType && selectedTransactionType == item.type) ? COLORS.white : COLORS.primary
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

  const getFilteredData = (type) => {
    let temp = categories.filter(category => category.type == type)
    return temp;
  }

  const renderCategoryList = () => {
    return (
      <View style={{ height: 55, marginLeft: 10 }}>
        {
          selectedTransactionType != 'all' &&
          <FlatList
            data={getFilteredData(selectedTransactionType)}
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
      }).map((data, index, array) => {
        return data.amount;
      }).reduce((acc, curValue, curIndex, array) => {
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
      <View style={{ flex: 1, marginTop: 10 }}>
        <FlatList
          contentContainerStyle={{
            padding: 10,
          }}
          showsVerticalScrollIndicator={false}
          data={transactions}
          keyExtractor={item => item.date}
          renderItem={renderTransactionInfoItem}
          ItemSeparatorComponent={() => (<View style={{ padding: 5 }} />)}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={{
      backgroundColor: COLORS.white,
      flex: 1,
    }}>
      <View style={{
        ...styles.walletContainer,
        ...styles.shadow,
        backgroundColor: 'gold',
        height: 250,
      }}>
        <View style={{ flex: 1, padding: 22 }}>
          <Text style={{ ...FONTS.body2, color: COLORS.darkgray }}>Số dư</Text>
          <Text style={{ ...FONTS.h1, fontSize: 35, color: COLORS.primary, marginTop: 5 }}>{account.amount} đ</Text>
        </View>
        <View style={{ width: '100%', alignSelf: 'center', paddingHorizontal: 10, paddingBottom: 10 }}>
          {renderMonthYearPicker()}
          {renderTransactionType()}
        </View>
      </View>

      <Animated.View style={{ height: categoryListHeightAnimationValue, marginTop: 0 }}>
        {renderCategoryList()}
      </Animated.View>

      {renderTransactionInfo()}

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
  walletContainer: {
    borderRadius: 40,
    marginHorizontal: 10,
    marginTop: 27
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
    height: 25,
    width: 25,
    marginHorizontal: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  }
})

export default HomeScreen;