import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableHighlight,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import { COLORS, SIZES, FONTS } from '../constants/theme';
import {
  category,
  cancel_icon,
  down_arrow,
  up_arrow
} from '../constants/icons'
import { addCategory, updateCategory } from '../redux/actions/categoriesAction';

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

const AddCategory = ({ route, navigation }) => {

  const isFocused = useIsFocused();
  const { categories } = useSelector(state => state.categoriesReducer);

  const dispatch = useDispatch();
  const addToCategories = (category) => dispatch(addCategory(navigation, category))
  const updateToCategories = (category, isTypeChanged = false) => dispatch(updateCategory(navigation, category, isTypeChanged))

  const [isIncomePressed, setIncomePressed] = useState(false);
  const [isExpensePressed, setExpensePressed] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState(null)

  const importData = categories.find(category => category.id === route.params)

  useEffect(() => {
    if (route.params) {
      setType(importData?.type)
      setName(importData?.name)
      importData?.type == 'income' ? setIncomePressed(true) : setExpensePressed(true)
    }
  }, [isFocused])

  const addNewCategory = () => {
    if (name === '') {
      Alert.alert(
        'Thêm danh mục mới thất bại',
        'Bạn chưa nhập tên danh mục mới'
      )
      return;
    }

    if (type === null) {
      Alert.alert(
        'Thêm danh mục mới thất bại',
        'Bạn chưa chọn nhóm'
      )
      return;
    }

    // let find = categories.filter(category => category.name === name && category.type == type)
    // if (find) {
    //   find.forEach(element => {
    //     if (element.name === name && element.type === type) {
    //       Alert.alert(
    //         'Thêm danh mục mới thất bại',
    //         'Danh mục này đã tồn tại'
    //       )
    //       return;
    //     }
    //   });
    // }
    if (categories.some(category => category.name === name && category.type == type)) {
      Alert.alert(
        'Thêm danh mục mới thất bại',
        'Danh mục này đã tồn tại'
      )
      return;
    }

    importData ?
      updateToCategories({
        id: importData.id,
        name: name,
        type: type
      }, type != importData.type) : addToCategories({
        name: name,
        type: type
      })
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
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
          <Text style={styles.header}>{importData ? 'Chỉnh sửa' : 'Thêm'} Phân loại</Text>
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
            onChangeText={(name) => { setName(name) }}
            underlineColorAndroid="transparent"
            placeholder="Tên phân loại"
            placeholderTextColor={COLORS.darkgray}
            blurOnSubmit={false}
            multiline={true}
            textAlignVertical='top'
            value={name}
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
              setType(type == 'expense' ? null : 'expense')
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
              setType(type == 'income' ? null : 'income')
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
          onPress={addNewCategory}
        >
          <Text style={styles.addButtonText}>{importData ? 'Chỉnh sửa' : 'Thêm'}</Text>
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