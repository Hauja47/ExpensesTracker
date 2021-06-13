import React from 'react';
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View
} from 'react-native';
import { LinearProgress } from 'react-native-elements';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const SplashScreen = () => {
    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.alignCenter}>
                <Text style={styles.appName}>Expense Tracker</Text>
                <LinearProgress
                    color={COLORS.white}
                    style={styles.loadBar}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: COLORS.blue
    },
    alignCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    appName: {
        ...FONTS.largeTitle,
        color: COLORS.white
    },
    loadBar: {
        width: SIZES.width - 20,
        margin: 20
    }
})

export default SplashScreen;