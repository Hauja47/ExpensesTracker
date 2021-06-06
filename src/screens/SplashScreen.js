import React, { useEffect } from 'react';
import {
    Text,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../constants/theme';
import { getCategories, getTransactions } from '../redux/actions/';

const SplashScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const { transactions } = useSelector(state => state.transactionsReducer);
    const { categories } = useSelector(state => state.categoriesReducer);

    useEffect(() => {
        navigation.navigate('HomeScreen');
    }, [transactions, categories])

    const getData = () => {
        // console.log(transactions, categories)
        dispatch(getTransactions());
        dispatch(getCategories());
    }

    return (
        <SafeAreaView style={[styles.background, styles.alignCenter]}>
            <Text>Loading...</Text>
            {getData()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: COLORS.blue
    },
    alignCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default SplashScreen;