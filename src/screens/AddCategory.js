import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { COLORS, SIZES, FONTS } from '../constants/theme';
import {
  category,
  cancel_icon,
  down_arrow,
  up_arrow
} from '../constants/icons'

const transactionType = [
  {
    name: 'Chi tiêu',
    icon: down_arrow,
  },
  {
    name: 'Thu nhập',
    icon: up_arrow,
  }
]

const AddCategory = ({ navigation }) => {

  const [isIncomePressed, setIncomePressed] = useState(false);
  const [isExpensePressed, setExpensePressed] = useState(false);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={styles.return}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <Image
              source={cancel_icon}
              style={styles.cancelIcon}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Thêm Phân loại</Text>
        </View>
        <View style={styles.containerTextInput}>
          <Image
            source={category}
            style={{ ...styles.iconInput, alignSelf: 'auto', marginTop: 20 }}
          />
          <TextInput
            style={{
              ...styles.textInput,
              height: 50
            }}
            onChangeText={(description) => { setDescription(description) }}
            underlineColorAndroid="transparent"
            placeholder="Tên phân loại"
            placeholderTextColor={COLORS.darkgray}
            blurOnSubmit={false}
            multiline={true}
            textAlignVertical='top'
          />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.containerButton}>
          <TouchableHighlight
            style={[
              {
                backgroundColor: isExpensePressed ? COLORS.red : COLORS.white,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                borderRightWidth: 0.5,
              },
              styles.button
            ]}
            underlayColor={COLORS.gray}
            onPress={() => {
              setExpensePressed(!isExpensePressed);
              if (isIncomePressed === true) {
                setIncomePressed(!isIncomePressed);
              }
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={transactionType[0].icon}
                style={[{ tintColor: isExpensePressed ? COLORS.white : COLORS.red }, styles.icon]}
              />
              <Text style={[
                { color: isExpensePressed ? COLORS.white : COLORS.black },
                styles.categoryButtonText
              ]}>{transactionType[0].name}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={[
            {
              backgroundColor: isIncomePressed ? COLORS.green : COLORS.white,
              borderLeftWidth: 0.5,
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
            },
            styles.button
          ]}
            underlayColor={COLORS.gray}
            onPress={() => {
              setIncomePressed(!isIncomePressed);
              if (isExpensePressed === true) {
                setExpensePressed(!isExpensePressed);
              }
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={transactionType[1].icon}
                style={[{ tintColor: isIncomePressed ? COLORS.white : COLORS.green }, styles.icon]}
              />
              <Text style={[
                { color: isIncomePressed ? COLORS.white : COLORS.black },
                styles.categoryButtonText
              ]}>{transactionType[1].name}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <TouchableOpacity
          style={styles.addButton}
        // onPress={}
        >
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    backgroundColor: COLORS.blue,
    height: SIZES.height * 0.3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  navigationBar: {
    flexDirection: 'row',
  },
  cancelIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  containerButton: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    elevation: 7,
    // bottom: 20,
    // position: 'absolute',
    alignSelf: 'center',
    marginHorizontal: 10,
    marginVertical: 20
  },
  categoryButtonText: {
    ...FONTS.h3,
    fontWeight: 'bold'
  },
  dropDownIcon: {
    height: 10,
    width: 10,
    marginLeft: 5,
  },
  icon: {
    alignSelf: 'center',
    height: 15,
    width: 15,
    marginRight: 5
  },
  iconInput: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    marginLeft: 10
  },
  button: {
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.gray
  },
  addButton: {
    width: SIZES.width,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    position: 'absolute'
  },
  addButtonText: {
    ...FONTS.h3,
    fontWeight: 'bold',
    color: 'white'
  },
  textInput: {
    ...FONTS.h2,
    height: 50,
    margin: 10,
    color: 'black',
    flex: 1,
  },
  containerTextInput: {
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
})

export default AddCategory;