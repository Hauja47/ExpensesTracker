import React from 'react';
import {
    TextInput,
    View,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage'
import { useSelector, useDispatch } from 'react-redux';

import { addCategory } from '../redux/actions/categoriesAction';
import { COLORS } from '../constants/theme';
import Mybutton from './components/Mybutton';

//var db = openDatabase({ name: 'fiance.db' });

const AddTransaction = ({ navigation }) => {

    const dispatch = useDispatch();

    const [categoryName, setCategoryName] = React.useState('')
    const [categoryType, setCategoryType] = React.useState('')

    const addToCategories = ({ navigation }, category) => {
        dispatch(
            addCategory({ navigation }, category)
        )
    }

    let addNewTransaction = () => {
        console.log('categoryName:', categoryName);
        console.log('categoryType:', categoryType);

        if (!categoryName) {
            alert('Please fill name');
            return;
        }
        if (!categoryType) {
            alert('Please fill type');
            return;
        }

        addToCategories({ navigation }, {
            name: categoryName,
            type: categoryType
        })
    }

    return (
        <View>
            <KeyboardAvoidingView
                style={{
                    marginLeft: 35,
                    marginRight: 35,
                    marginTop: 10,
                    borderColor: COLORS.purple,
                    borderWidth: 1,
                }}>
                <TextInput
                    style={{
                        marginTop: 5,
                        padding: 10
                    }}
                    underlineColorAndroid="transparent"
                    placeholder="Tên danh mục"
                    placeholderTextColor={COLORS.darkgray}
                    returnKeyType='next'
                    onChangeText={
                        (categoryName) => { setCategoryName(categoryName) }
                    }
                    blurOnSubmit={false}
                />
                <TextInput
                    style={{
                        marginTop: 5,
                        padding: 10
                    }}
                    underlineColorAndroid="transparent"
                    placeholder="Income/Expense"
                    returnKeyType='next'
                    onChangeText={
                        (categoryType) => { setCategoryType(categoryType) }
                    }
                    placeholderTextColor={COLORS.darkgray}
                    blurOnSubmit={false}
                />
            </KeyboardAvoidingView>

            <Mybutton
                styles={{ position: 'absolute', bottom: 10, }}
                title='Add'
                customClick={addNewTransaction}
            />
        </View>
    )
}

export default AddTransaction;