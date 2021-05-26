import 'react-native-gesture-handler';
// import { FlatList } from 'react-native-gesture-handler';
import React, { useState, createRef, useEffect } from 'react';
import {
    TextInput,
    View,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    SafeAreaView,
    Button,
    FlatList
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ActionSheet from "react-native-actions-sheet";
import NumberFormat from 'react-number-format';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { addTransaction } from '../redux/actions/transactionsAction';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { cancel_icon, drop_down_arrow } from '../constants/icons'
import { getCategories } from '../redux/actions/categoriesAction'

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const Tab = createMaterialTopTabNavigator();
const actionSheetRef = createRef();

const AddTransaction = ({ navigation }) => {

    const dispatch = useDispatch();

    const { categories } = useSelector(state => state.categoriesReducer);
    const fetchCategories = () => dispatch(getCategories());

    const [date, setDate] = useState(new Date());
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        GetCategoriesByType('expense');
        GetCategoriesByType('income');
    }, [])

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

    const renderCategory = ({ item }) => {
        return (
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
    }

    const renderSeperator = () => {
        return (
            <View
                style={{
                    padding: 0.5,
                    backgroundColor: '#c8c7cc'
                }}
            />
        )
    }

    const CategoriesByType = (props) => {
        return (
            <FlatList
                listKey={props.type}
                data={props.data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderCategory({ item })}
                style={styles.categorieslist}
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

    const addToTransaction = (data, { navigation }) => {
        dispatch(
            addTransaction(data, { navigation })
        )
    }

    const addNewTransaction = () => {

    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View
                style={{
                    height: 80,
                    backgroundColor: COLORS.blue,
                    height: '40%',
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity
                    style={{ justifyContent: 'center', width: 50, left: 20, alignSelf: 'flex-start', paddingVertical: 24 }}
                    onPress={() => navigation.navigate('HomeScreen')}
                >
                    <Image
                        source={cancel_icon}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.white,
                        }}
                    />
                </TouchableOpacity>
                <Text style={{ margin: 20, fontSize: 20, color: COLORS.white, alignSelf: 'flex-start' }}>Thêm Giao dịch</Text>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderRadius: 10,
                    elevation: 7,
                    bottom: 20,
                    backgroundColor: COLORS.white,
                    position: 'absolute',
                    alignSelf: 'center',
                    marginHorizontal: 10
                }}
                >
                    <NumberFormat
                        value={amount}
                        displayType={'text'}
                        thousandSeparator={true}
                        renderText={(value) => (
                            <TextInput
                                style={{
                                    ...FONTS.h2,
                                    width: WIDTH - 210,
                                    height: 50,
                                    margin: 10,
                                    color: 'black'
                                }}
                                underlineColorAndroid="transparent"
                                placeholder="Số tiền"
                                placeholderTextColor={COLORS.darkgray}
                                returnKeyType='next'
                                onChangeText={(amount) => { setAmount(amount) }}
                                blurOnSubmit={false}
                                multiline={true}
                                numberOfLines={2}
                                keyboardType='number-pad'
                                value={value}
                            />
                        )}
                    />
                    <Text style={{ ...FONTS.h2, alignSelf: 'center', marginRight: 5 }}>đ</Text>
                    <TouchableOpacity
                        style={{
                            width: 150,
                            height: '100%',
                            borderRadius: 10,
                            backgroundColor: (category == '') ? COLORS.gray : ((category.type === 'income') ? COLORS.green : COLORS.red),
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}
                        onPress={() => {
                            actionSheetRef.current?.setModalVisible();
                        }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}>
                            <Text style={{ ...FONTS.h3, color: 'white', fontWeight: 'bold' }}>{(category === '') ? 'Chọn phân loại' : category.name}</Text>
                            <Image
                                source={drop_down_arrow}
                                style={{
                                    height: 10,
                                    width: 10,
                                    marginLeft: 5,
                                    tintColor: 'white'
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView style={{
                flex: 1,
            }}
            >
                <ActionSheet
                    ref={actionSheetRef}
                    bounceOnOpen={true}
                    elevation={10}
                >
                    <View
                        style={{
                            height: HEIGHT / 1.5
                        }}
                    >
                        <Tab.Navigator  
                            swipeEnabled={true}
                            initialRouteName={'Chi tiêu'}
                            initialLayout={{ width: WIDTH }}
                        >
                            <Tab.Screen name='Chi tiêu' component={Expense} />
                            <Tab.Screen name="Thu nhập" component={Income} />
                        </Tab.Navigator>
                    </View>
                </ActionSheet>
            </KeyboardAvoidingView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    categorieslist: {
        flex: 1,
        backgroundColor: COLORS.white,
    }
})

export default AddTransaction;