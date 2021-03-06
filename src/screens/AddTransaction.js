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
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ActionSheet from "react-native-actions-sheet";
import NumberFormat from 'react-number-format';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DateTimePicker from '@react-native-community/datetimepicker';

import { addTransaction, updateTransaction } from '../redux/actions/transactionsAction';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import {
  cancel_icon,
  drop_down_arrow,
  paragrapgh,
  wallet,
  calendar,
  category as categoryIcon
} from '../constants/icons';

const Tab = createMaterialTopTabNavigator();
const actionSheetRef = createRef();
const { DateTime } = require("luxon");

const AddTransaction = ({ route, navigation }) => {

  const importData = route.params;

  const dispatch = useDispatch();

  const { categories } = useSelector(state => state.categoriesReducer);

  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [height, setHeight] = useState(50);
  const [showDTPicker, setDTPickerVisible] = useState(false);

  useEffect(() => {
    if (importData) {
      setDate(new Date(importData.date))
      setCategory({
        name: importData.name,
        type: importData.type
      })
      setDescription(importData.description)
      setAmount((importData.amount < 0) ? -importData.amount : importData.amount)
    }
  }, [])

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
    <CategoriesByType data={categories.filter(category => category.type === 'expense')} type='expense' />
  )

  const Income = () => (
    <CategoriesByType data={categories.filter(category => category.type === 'income')} type='income' />
  )

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDTPickerVisible(false);
    setDate(currentDate);
  };

  const addToTransaction = (data) => dispatch(addTransaction(data, navigation))
  const updateToTransaction = (data) => dispatch(updateTransaction(data, importData.date, navigation))

  const checkNewTransaction = () => {
    if (!amount || amount == 0) {
      Alert.alert(
        importData ? 'Ch???nh s???a giao d???ch m???i th???t b???i' : 'Th??m giao d???ch m???i th???t b???i',
        'B???n c???n nh???p s??? ti???n'
      )
      return;
    }

    if (!description) {
      Alert.alert(
        importData ? 'Ch???nh s???a giao d???ch m???i th???t b???i' : 'Th??m giao d???ch m???i th???t b???i',
        'B???n n??n nh???p ghi ch??'
      )
      return;
    }

    if (!category) {
      Alert.alert(
        importData ? 'Ch???nh s???a giao d???ch m???i th???t b???i' : 'Th??m giao d???ch m???i th???t b???i',
        'B???n n??n ch???n ph??n lo???i'
      )
      return;
    }

    let convertedAmount = (amount.toString().includes(',')) ? amount.replace(/,/g, '') : amount;
    let data = {
      id: importData ? importData.id : null,
      name: category.name,
      amount: category.type == 'income' ? convertedAmount : -convertedAmount,
      description: description,
      date: DateTime.fromISO(date.toISOString()).toFormat('yyyy-MM-dd'),
      type: category.type
    }

    importData ? updateToTransaction(data) : addToTransaction(data);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
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
          <Text style={styles.header}>{importData ? 'Ch???nh s???a Giao d???ch' : 'Th??m Giao d???ch'}</Text>
        </View>

        <View style={styles.amountInput}>
          <Image
            source={wallet}
            style={styles.icon}
          />
          <NumberFormat
            value={amount}
            displayType={'text'}
            thousandSeparator={true}
            allowNegative={false}
            allowLeadingZeros={false}
            renderText={(value) => (
              <TextInput
                style={styles.textInput}
                underlineColorAndroid="transparent"
                placeholder="S??? ti???n"
                placeholderTextColor={COLORS.darkgray}
                returnKeyType='next'
                onChangeText={(amount) => { 
                  while(amount.startsWith(0)) {
                    amount = amount.substr(1)
                  }
                  amount = amount.replace(/[^0-9]/g, "")
                  setAmount(amount) 
                }}
                blurOnSubmit={false}
                keyboardType='decimal-pad'
                value={value}
                numberOfLines={1}
              />
            )}
          />
          <Text style={{ ...FONTS.h2, alignSelf: 'center', marginRight: 5 }}>??</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={[styles.container, { flex: 1 }]}
        behavior='padding'
        keyboardVerticalOffset={-500}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 15 }}
        >
          <View
            style={[styles.containerTextInput, { alignItems: 'center', justifyContent: 'space-between' }]}
          >
            <Image
              source={categoryIcon}
              style={styles.icon}
            />
            <Text style={{ ...FONTS.h2, marginHorizontal: 14 }}>Danh m???c:</Text>
            <TouchableOpacity
              style={{
                ...styles.categoryButton,
                backgroundColor: (category == '') ? COLORS.gray : ((category.type === 'income') ? COLORS.green : COLORS.red),
              }}
              onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}
            >
              <View style={styles.innerButton}>
                <Text style={styles.categoryButtonText}>{(category === '') ? 'Ch???n ph??n lo???i' : category.name}</Text>
                <Image
                  source={drop_down_arrow}
                  style={styles.dropDownIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.containerTextInput}>
            <Image
              source={calendar}
              style={{ ...styles.icon, alignSelf: 'center', marginRight: 15 }}
            />
            <TouchableOpacity
              onPress={() => { setDTPickerVisible(true) }}
            >
              <Text style={{ ...FONTS.h2, paddingVertical: 20 }}>{DateTime.fromISO(date.toISOString()).toFormat('DDDD')}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.containerTextInput, { flexWrap: 'wrap' }]}>
            <Image
              source={paragrapgh}
              style={{ ...styles.icon, alignSelf: 'auto', marginTop: 20 }}
            />
            <TextInput
              value={description}
              style={{
                ...styles.textInput,
                height: Math.max(50, height)
              }}
              onChangeText={(description) => { setDescription(description) }}
              onContentSizeChange={(event) => {
                setHeight(event.nativeEvent.contentSize.height)
              }}
              underlineColorAndroid="transparent"
              placeholder="Ghi ch??"
              placeholderTextColor={COLORS.darkgray}
              blurOnSubmit={false}
              multiline={true}
              textAlignVertical='top'
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={checkNewTransaction}
      >
        <Text style={styles.categoryButtonText}>{importData ? 'Ch???nh s???a' : 'Th??m'}</Text>
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
            initialRouteName={'Chi ti??u'}
            initialLayout={{ width: SIZES.width }}
            sceneContainerStyle={styles.container}
          >
            <Tab.Screen name='Chi ti??u' component={Expense} />
            <Tab.Screen name="Thu nh???p" component={Income} />
          </Tab.Navigator>
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => {
              actionSheetRef.current?.setModalVisible(false);
              navigation.navigate('AddCategory')
            }}
          >
            <Text style={styles.categoryButtonText}>Th??m</Text>
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
    </View>
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
    flex: 1,
    height: 65,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
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