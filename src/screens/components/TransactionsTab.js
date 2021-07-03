import 'react-native-gesture-handler';
import React, { useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import NumberFormat from 'react-number-format';
import MonthPicker from 'react-native-month-year-picker'
import { ButtonGroup } from 'react-native-elements';
import Dialog from 'react-native-dialog';

import { updateAccount } from '../../redux/actions/accountAction'
import Chip from './Chip'
import { COLORS, FONTS } from '../../constants/theme';
import {
  down_arrow,
  up_arrow,
  drop_down_arrow,
  edit,
  plus
} from '../../constants/icons';

const { DateTime } = require('luxon')

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

const TransactionsTab = ({ navigation }) => {

  const dispatch = useDispatch();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMYP, setshowMYP] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedCategories, changeCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newAmount, setAmount] = useState();

  const { transactions } = useSelector(state => state.transactionsReducer);
  const { categories } = useSelector(state => state.categoriesReducer);
  const { account } = useSelector(state => state.accountReducer);

  const categoryListHeightAnimationValue = useRef(new Animated.Value(0)).current;
  const flatlistTrnInfRef = useRef();

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
          <Text style={{ ...FONTS.h3, color: COLORS.white }}>Tháng {DateTime.fromJSDate(date).month} năm {date.getFullYear()}</Text>
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

  const renderCategoryList = () => {

    const getFilteredData = () => {
      if (selectedIndex === 0) {
        return categories;
      }

      let temp = categories.filter(category => category.type === transactionType[selectedIndex].type)
      return temp;
    }

    const handlePress = (item) => {
      if (selectedCategories.includes(item.name)) {
        let temp = selectedCategories.filter((t) => t !== item.name);
        changeCategories(temp);
      } else {
        changeCategories([...selectedCategories, item.name])
      }
    }

    const renderCategoryListItem = ({ item }) => (
      <Chip
        tittle={item.name}
        onPress={() => handlePress(item)}
        color={transactionType[selectedIndex].color}
      />
    )

    return (
      <View style={{ height: 55, marginLeft: 10 }}>
        {
          selectedIndex != 0 &&
          <FlatList
            ref={flatlistTrnInfRef}
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

  const renderTransactionType = () => {

    const updateIndex = (index) => {
      if (index !== selectedIndex) {
        changeCategories([])
      }

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
          flatlistTrnInfRef.current?.scrollToOffset({ offset: 0 });
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
      const renderSeperator = () => <View style={styles.transactionListSeperator} />

      const filterDataByCategory = (transactionInDate) => {
        switch (selectedIndex) {
          case 0:
            return transactionInDate;
          case 1:
          case 2:
            switch (selectedCategories.length) {
              case 0:
                return transactionInDate.filter(transaction => transaction.type === transactionType[selectedIndex].type)
              default:
                return transactionInDate.filter(transaction => selectedCategories.includes(transaction.name))
            }
        }
      }

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
                data={filterDataByCategory(item.data)}
                keyExtractor={item => item.id}
                renderItem={renderTransactionInfoItemData}
                ItemSeparatorComponent={renderSeperator}
              />
            </View>
          </View>
          <View style={styles.detailDayContainer}>
            {
              (selectedIndex == 0 || selectedIndex == 2) &&
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
            }
            {
              (selectedIndex == 0 || selectedIndex == 1) &&
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
            }
          </View>
        </View>
      )
    }

    const filterDataByDate = () => {
      let filterDataByDate = transactions.filter(tn =>
        DateTime.fromFormat(tn.date, 'yyyy-MM-dd').month === DateTime.fromJSDate(date).month &&
        DateTime.fromFormat(tn.date, 'yyyy-MM-dd').year === DateTime.fromJSDate(date).year
      )

      switch (selectedIndex) {
        case 0:
          return filterDataByDate;
        case 1:
        case 2:
          if (selectedCategories.length) {
            return filterDataByDate.filter(element =>
              element.data.find(item => selectedCategories.includes(item.name))
            );
          } else {
            return filterDataByDate.filter(element =>
              element.data.find(item => item.type == transactionType[selectedIndex].type)
            );
          }
      }
    }

    return (
      <FlatList
        ref={flatlistTrnInfRef}
        contentContainerStyle={{
          padding: 10,
        }}
        showsVerticalScrollIndicator={false}
        data={filterDataByDate()}
        keyExtractor={item => item.date}
        renderItem={renderTransactionInfoItem}
        ItemSeparatorComponent={() => (<View style={{ padding: 7 }} />)}
        initialNumToRender={7}
      />
    )
  }

  const handleAmountEditButtonVisible = () => {
    setAmount('');
    setVisible(!visible);
  }

  const handleAmountChange = () => {
    if (newAmount === '') {
      Alert.alert(
        'Cảnh báo',
        'Bạn chưa nhập số tiền'
      )
      return;
    }

    let temp = newAmount.replace(/,/g, '');
    dispatch(updateAccount({ amount: temp, id: 1 }));
    handleAmountEditButtonVisible();
  }

  return (
    <SafeAreaView style={{
      backgroundColor: COLORS.white,
      flex: 1,
    }}>
      <View style={{
        height: 100,
        backgroundColor: COLORS.blue,
        flexDirection: 'row'
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          marginHorizontal: 10
        }}>
          <View style={{ flexDirection: 'row' }}>
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
          marginRight: 10,
        }}
          onPress={handleAmountEditButtonVisible}
        >
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
      >
        <Image
          source={plus}
          style={styles.icon}
        />
      </TouchableOpacity>

      <View style={styles.container}>
        <Dialog.Container visible={visible}>
          <Dialog.Title style={styles.dialogTittle}>Thay đổi số dư</Dialog.Title>
          <Dialog.Description style={FONTS.body2}>
            Nhập số tiền mới:
          </Dialog.Description>
          <NumberFormat
            value={newAmount}
            displayType={'text'}
            thousandSeparator={true}
            allowNegative={false}
            allowLeadingZeros={false}
            renderText={(value) => (
              <Dialog.Input
                underlineColorAndroid={COLORS.blue}
                placeholder="Số tiền"
                placeholderTextColor={COLORS.darkgray}
                returnKeyType='next'
                onChangeText={(amount) => { 
                  console.log(amount[0] == 0)
                  if (amount[0] == 0) {
                    amount = amount.replace("0", "")
                  }
                  setAmount(amount) 
                }}
                blurOnSubmit={false}
                keyboardType='decimal-pad'
                numberOfLines={1}
                wrapperStyle={styles.wrapperStyle}
                style={FONTS.h3}
                value={value}
              />
            )}
          />
          <Dialog.Button label="Hủy" onPress={handleAmountEditButtonVisible} />
          <Dialog.Button label="Thay đổi" onPress={handleAmountChange} />
        </Dialog.Container>
      </View>
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
    bottom: 10,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center'
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
  },
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapperStyle: {
    height: 80,
  },
  dialogTittle: {
    ...FONTS.h3,
    color: COLORS.darkgray
  }
})

export default TransactionsTab;