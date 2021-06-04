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
  Button,
  Alert,
  FlatList
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

const AddCategory = ({ navigation }) => {

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.darkgray
    }}>
      <Text style={styles.categoryButtonText}>{item.name}</Text>
    </TouchableOpacity>
  )

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
        <View style={styles.containerButton}>
          <TouchableOpacity style={{
            width: '50%',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.darkgray,
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            borderRightWidth: 1
          }}>

            <Text style={styles.categoryButtonText}>{transactionType[0].name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            width: '50%',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.darkgray,
            borderLeftWidth: 1,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
          }}>
            <Text style={styles.categoryButtonText}>{transactionType[1].name}</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    elevation: 7,
    bottom: 20,
    // backgroundColor: COLORS.white,
    position: 'absolute',
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  categoryButtonText: {
    ...FONTS.h3,
    color: 'black',
    fontWeight: 'bold'
  },
  dropDownIcon: {
    height: 10,
    width: 10,
    marginLeft: 5,
  },
})

export default AddCategory;