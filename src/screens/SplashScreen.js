import React, { useEffect } from 'react';
import {
    Text,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../constants/theme';
import { getCategories, getTransactions } from '../redux/actions'

const SplashScreen = ({navigation}) => {

    const dispatch = useDispatch();
    const { isCategoriesLoaded } = useSelector(state => state.categoriesReducer)
    const { isTransactionsLoaded } = useSelector(state => state.transactionsReducer)

    useEffect(() => {
        navigation.navigate('HomeScreen')
    }, [isCategoriesLoaded, isTransactionsLoaded])

    const getData = ()  => {
        dispatch(getCategories());
        dispatch(getTransactions());
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