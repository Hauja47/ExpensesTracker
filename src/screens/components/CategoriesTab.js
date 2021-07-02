import 'react-native-gesture-handler'
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/core';

import CheckBox from './CheckBox';
import { COLORS, FONTS } from '../../constants/theme';
import {
  delete_icon,
  edit,
  category,
  plus,
  drop_down_arrow,
} from '../../constants/icons';
import { deleteCategory } from '../../redux/actions/categoriesAction';

const CategoriesTab = ({ navigation }) => {

  const { categories } = useSelector(state => state.categoriesReducer);

  const [activeSections, setActiveSections] = useState([]);
  const [selectedCategories, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [categories])

  const renderHeader = (section) => (
    <View style={[styles.collapseHeader, { backgroundColor: (section.title == 'Chi tiêu') ? COLORS.red : COLORS.green }]}>
      <Text style={{ ...FONTS.body2, color: 'white', padding: 10 }}>{section.title}</Text>
      <Image source={drop_down_arrow} style={styles.icon} />
    </View>
  )

  const handleCheck = (key) => {
    if (selectedCategories.includes(key)) {
      let temp = selectedCategories.filter(id => id != key)
      setSelected(temp)
    } else {
      setSelected([...selectedCategories, key])
    }
  }

  const renderCategoriesItem = ({ item }) => (
    <CheckBox
      title={item.name}
      id={item.id}
      onPress={handleCheck}
    />
    // <Text key={item.id} style={{padding: 10, ...FONTS.body2}}>{item.name}</Text>
  )

  const renderContent = (section) => {
    return (
      <FlatList
        data={categories?.filter(item => item.type === section.type)}
        keyExtractor={item => item.id}
        renderItem={renderCategoriesItem}
      />
    )
  }

  const onChange = (activeSections) => {
    setActiveSections(activeSections)
  }

  const handleEdit = () => {
    navigation.navigate("AddCategory", selectedCategories[0])
  }

  // const handleDelete = () => {
  // }

  return (
    <SafeAreaView style={styles.background}>
      <View style={[
        styles.navigationBar,
        { justifyContent: 'space-between' }
      ]}>
        <View style={styles.navigationBar}>
          <Image
            source={category}
            style={styles.icon}
          />
          <Text
            style={styles.header}
            ellipsizeMode='clip'
            numberOfLines={1}
          >
            Danh mục
          </Text>
        </View>
        <View style={styles.navigationBar}>
          {/* <TouchableOpacity
            style={styles.button}
            disabled={selectedCategories.length === 0}
          >
            <Image
              source={delete_icon}
              style={[styles.icon, { tintColor: selectedCategories.length === 0 ? COLORS.gray : COLORS.white }]}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            disabled={selectedCategories.length !== 1}
            onPress={handleEdit}
          >
            <Image
              source={edit}
              style={[styles.icon, { tintColor: selectedCategories.length !== 1 ? COLORS.gray : COLORS.white }]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Accordion
        sections={[
          {
            id: 1,
            title: 'Chi tiêu',
            type: 'expense',
          },
          {
            id: 2,
            title: 'Thu nhập',
            type: 'income',
          }
        ]}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={onChange}
        underlayColor='transparent'
        expandMultiple={true}
        keyExtractor={item => item.id}
        renderChildrenCollapsed={false}
        renderAsFlatList={true}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCategory')}
      >
        <Image
          source={plus}
          style={styles.icon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  navigationBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.blue,
    height: 100
  },
  header: {
    fontSize: 24,
    color: COLORS.white,
    alignSelf: 'center'
  },
  button: {
    justifyContent: 'center',
    width: 50,
  },
  icon: {
    height: 25,
    width: 25,
    marginHorizontal: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    tintColor: COLORS.white
  },
  addButton: {
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
  collapseHeader: {
    justifyContent: 'space-between',
    margin: 5,
    flexDirection: 'row',
    borderRadius: 10
  }
})

export default CategoriesTab;