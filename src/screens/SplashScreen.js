import React, { useEffect } from 'react';
import {
    Text,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/theme';

const SplashScreen = () => {
    return (
        <SafeAreaView style={[styles.background, styles.alignCenter]}>
            <Text>Loading...</Text>
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