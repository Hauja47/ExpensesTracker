import 'react-native-gesture-handler';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    ScrollView
} from 'react-native'
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { cancel_icon, edit, delete_icon } from '../constants/icons';
import NumberFormat from 'react-number-format';

const { DateTime } = require('luxon');


const TransactionDetail = ({ route, navigation }) => {

    const data = route.params;
    const date = DateTime.fromFormat(data.date, 'yyyy-MM-dd').setLocale('vi');

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.navigationBar}>
                <TouchableOpacity
                    style={styles.return}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={cancel_icon}
                        style={styles.returnIcon}
                    />
                </TouchableOpacity>
                <Text
                    style={styles.header}
                    ellipsizeMode='clip'
                    numberOfLines={1}
                >
                    Thông tin Giao dịch
                </Text>
                <View style={styles.navigationBar}>
                    <TouchableOpacity
                        style={styles.button}
                    >
                        <Image
                            source={delete_icon}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                    >
                        <Image
                            source={edit}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.detailContainer}>
                <View style={styles.elementContainer}>
                    <Text style={styles.elementText}>Thời gian:</Text>
                    <Text style={styles.detailText}>{date.toFormat('DDDD')}</Text>
                </View>
                <View style={styles.elementContainer}>
                    <Text style={styles.elementText}>Số tiền:</Text>
                    <NumberFormat
                        value={data.amount}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix='đ'
                        renderText={formattedValue =>
                            <Text style={
                                [
                                    styles.detailText,
                                    {
                                        color: (data.type === 'expense') ?
                                            COLORS.red :
                                            COLORS.green
                                    }
                                ]
                            }
                            >
                                {formattedValue}
                            </Text>
                        }
                    />
                </View>
                <View style={styles.elementContainer}>
                    <Text style={styles.elementText}>Danh mục:</Text>
                    <Text style={[
                        styles.detailText,
                        {
                            color: (data.type === 'expense') ?
                                COLORS.red :
                                COLORS.green
                        }
                    ]}>{data.category}</Text>
                </View>
                <View style={styles.elementContainer}>
                    <Text style={styles.elementText}>Ghi chú:</Text>
                    <ScrollView>
                        <Text style={styles.detailText}>{data.description}</Text>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    return: {
        justifyContent: 'center',
        width: 50,
        left: 20,
        alignSelf: 'flex-start',
        paddingVertical: 24
    },
    returnIcon: {
        width: 20,
        height: 20,
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    header: {
        margin: 20,
        fontSize: 20,
        color: COLORS.black,
        alignSelf: 'flex-start'
    },
    button: {
        justifyContent: 'center',
        width: 50,
    },
    icon: {
        height: 25,
        width: 25,
        marginLeft: 10
    },
    detailContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 10
    },
    elementContainer: {
        width: SIZES.width,
        justifyContent: 'space-between',
        padding: 10
    },
    elementText: {
        ...FONTS.body3,
        color: COLORS.darkgray
    },
    detailText: {
        ...FONTS.h2
    }
});

export default TransactionDetail;