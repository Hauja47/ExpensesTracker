import 'react-native-gesture-handler';
import { FlatList } from 'react-native-gesture-handler';
import React, { useState, createRef, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ActionSheet from "react-native-actions-sheet";
import NumberFormat from 'react-number-format';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from '@react-navigation/native';

import { addTransaction } from '../redux/actions/transactionsAction';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { cancel_icon, drop_down_arrow, paragrapgh, wallet, calendar } from '../constants/icons';

const Tab = createMaterialTopTabNavigator();
const actionSheetRef = createRef();
const { DateTime } = require("luxon");

const AddTransaction = ({ navigation }) => {

  const dispatch = useDispatch();

  const { categories } = useSelector(state => state.categoriesReducer);

  const isFocus = useIsFocused();
  
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [showDTPicker, setDTPickerVisible] = useState(false);

  useEffect(() => {
    GetCategoriesByType('expense');
    GetCategoriesByType('income');
  }, [isFocus])

  const GetCategoriesByType = async (type) => {
    let temp = categories.filter(category => category.type === type)
    switch (type) {
      case 'income':
        setIncomeCategories(temp)
        break;
      case 'expense':
        setExpenseCategories(temp)
        break;
    }
  }

  const handleCategoryButton = (category) => {
    setCategory(category);
    actionSheetRef.current?.setModalVisible(false);
  }

  const renderCategory = ({ item }) => (
    <TouchableHighlight
      style={{
        width: '100%',
        padding: 20,
      }}
      underlayColor={COLORS.lightGray}
      onPress={() => {
        handleCategoryButton(item)
      }}
    >
      <Text style={{ ...FONTS.h2, color: COLORS.black, marginLeft: 20 }}>{item.name}</Text>
    </TouchableHighlight>
  )

  const renderSeperator = () => (
    <KeyboardAvoidingView style={styles.listSeperator} />
  )

  const CategoriesByType = (props) => {
    return (
      <FlatList
        listKey={props.type}
        data={props.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderCategory({ item })}
        ItemSeparatorComponent={renderSeperator}
        nestedScrollEnabled={true}
        onScrollEndDrag={() =>
          actionSheetRef.current?.handleChildScrollEnd()
        }
        onScrollAnimationEnd={() =>
          actionSheetRef.current?.handleChildScrollEnd()
        }
        onMomentumScrollEnd={() =>
          actionSheetRef.current?.handleChildScrollEnd()
        }
      />
    )
  }

  const Expense = () => (
    <CategoriesByType data={expenseCategories} type='expense' />
  )

  const Income = () => (
    <CategoriesByType data={incomeCategories} type='income' />
  )

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDTPickerVisible(false);
    setDate(currentDate);
  };

  const addToTransaction = (data) => dispatch(addTransaction(data, navigation))

  const checkNewTransaction = () => {
    if (amount === '') {
      Alert.alert('Thêm giao dịch mới thất bại', 'Bạn cần nhập số tiền')
      return;
    }

    if (description === '') {
      Alert.alert('Thêm giao dịch mới thất bại', 'Bạn nên nhập ghi chú')
      return;
    }

    if (category === '') {
      Alert.alert('Thêm giao dịch mới thất bại', 'Bạn nên chọn phân loại')
      return;
    }

    let data = {
      category_id: category.id,
      amount: amount,
      description: description,
      date: DateTime.fromISO(date.toISOString()).toFormat('yyyy-MM-dd'),
    }

    addToTransaction(data);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.headerContainer}>
        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={styles.return}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={cancel_icon}
              style={styles.cancelIcon}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Thêm Giao dịch</Text>
        </View>

        <View style={styles.amountInput}>
          <Image
            source={wallet}
            style={styles.icon}
          />
          <NumberFormat
            value={amount}
            displayType={'text'}
            thousandSeparator={false}
            renderText={(value) => (
              <TextInput
                style={styles.textInput}
                underlineColorAndroid="transparent"
                placeholder="Số tiền"
                placeholderTextColor={COLORS.darkgray}
                returnKeyType='next'
                onChangeText={(amount) => { setAmount(amount) }}
                blurOnSubmit={false}
                keyboardType='number-pad'
                value={value}
                numberOfLines={1}
              />
            )}
          />
          <Text style={{ ...FONTS.h2, alignSelf: 'center', marginRight: 5 }}>đ</Text>
          <TouchableOpacity
            style={{
              ...styles.categoryButton,
              backgroundColor: (category == '') ? COLORS.gray : ((category.type === 'income') ? COLORS.green : COLORS.red),
            }}
            onPress={() => {
              actionSheetRef.current?.setModalVisible();
            }}
          >
            <KeyboardAvoidingView style={styles.innerButton}>
              <Text style={styles.categoryButtonText}>{(category === '') ? 'Chọn phân loại' : category.name}</Text>
              <Image
                source={drop_down_arrow}
                style={styles.dropDownIcon}
              />
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.container, { flex: 1 }]}>
        <View style={styles.containerTextInput}>
          <Image
            source={calendar}
            style={{ ...styles.icon, alignSelf: 'center', marginRight: 15 }}
          />
          <TouchableOpacity
            onPress={() => { setDTPickerVisible(true) }}
          >
            <Text style={{ ...FONTS.h2, paddingVertical: 20 }}>{DateTime.fromISO(date.toISOString()).toFormat('dd/MM/yyyy')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerTextInput}>
          <Image
            source={paragrapgh}
            style={{ ...styles.icon, alignSelf: 'auto', marginTop: 20 }}
          />
          <TextInput
            style={{
              ...styles.textInput,
              height: 150
            }}
            onChangeText={(description) => { setDescription(description) }}
            underlineColorAndroid="transparent"
            placeholder="Ghi chú"
            placeholderTextColor={COLORS.darkgray}
            blurOnSubmit={false}
            multiline={true}
            textAlignVertical='top'
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={checkNewTransaction}
      >
        <Text style={styles.categoryButtonText}>Thêm</Text>
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        bounceOnOpen={true}
        elevation={10}
        gestureEnabled={true}
        initialLayout={{ width: SIZES.width }}
      >
        <View style={styles.actionSheet}>
          <Tab.Navigator
            swipeEnabled={true}
            initialRouteName={'Chi tiêu'}
            initialLayout={{ width: SIZES.width }}
            sceneContainerStyle={styles.container}
          >
            <Tab.Screen name='Chi tiêu' component={Expense} />
            <Tab.Screen name="Thu nhập" component={Income} />
          </Tab.Navigator>
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => {
              actionSheetRef.current?.setModalVisible(false);
              navigation.navigate('AddCategory')
            }}
          >
            <Text style={styles.categoryButtonText}>Thêm</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
      {showDTPicker && (
        <DateTimePicker
          value={date}
          mode={'date'}
          display="default"
          onChange={onChange}
        />
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  header: {
    margin: 20,
    fontSize: 20,
    color: COLORS.white,
    alignSelf: 'flex-start'
  },
  return: {
    justifyContent: 'center',
    width: 50,
    left: 20,
    alignSelf: 'flex-start',
    paddingVertical: 24
  },
  textInput: {
    ...FONTS.h2,
    height: 50,
    margin: 10,
    color: 'black',
    flex: 1,
  },
  actionSheet: {
    height: SIZES.height / 2.0,
    backgroundColor: 'white'
  },
  dropDownIcon: {
    height: 10,
    width: 10,
    marginLeft: 5,
    tintColor: 'white'
  },
  innerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  categoryButton: {
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    width: '40%'
  },
  categoryButtonText: {
    ...FONTS.h3,
    color: 'white',
    fontWeight: 'bold'
  },
  amountInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    elevation: 7,
    bottom: 20,
    backgroundColor: COLORS.white,
    position: 'absolute',
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  cancelIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  navigationBar: {
    flexDirection: 'row',
  },
  headerContainer: {
    backgroundColor: COLORS.blue,
    height: SIZES.height * 0.3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  listSeperator: {
    padding: 0.5,
    backgroundColor: '#c8c7cc'
  },
  icon: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    marginLeft: 10
  },
  containerTextInput: {
    marginTop: 10,
    flexDirection: 'row',
    borderRadius: 10,
    elevation: 7,
    backgroundColor: COLORS.white,
    marginHorizontal: 10,
  },
  addButton: {
    width: SIZES.width,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  addCategoryButton: {
    width: SIZES.width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blue,
  },
})

export default AddTransaction;