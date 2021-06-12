import 'react-native-gesture-handler';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    ScrollView,
    Alert
} from 'react-native'
import NumberFormat from 'react-number-format';
import { useDispatch } from 'react-redux'

import { COLORS, SIZES, FONTS } from '../constants/theme';
import {
    back,
    edit,
    delete_icon,
    category,
    calendar,
    wallet,
    paragrapgh
} from '../constants/icons';
import { deleteTransaction } from '../redux/actions/transactionsAction';

const { DateTime } = require('luxon');

const TransactionDetail = ({ route, navigation }) => {

    const data = route.params;
    const date = DateTime.fromFormat(data.date, 'yyyy-MM-dd').setLocale('vi');

    const dispatch = useDispatch();

    const handleDelete = () => {
        Alert.alert(
            'Cảnh báo',
            'Bạn sẽ không thể hoàn tác một khi tiếp tục!\nXác định?',
            [
                { text: 'Hủy' },
                { text: 'Xác định', onPress: () => dispatch(deleteTransaction(data.id, data.date, navigation)) }
            ],
            { cancelable: false }
        )
    }

    const handleEdit = () => {
        navigation.navigate('AddTransaction', data)
    }

    return (
        <SafeAreaView style={styles.background}>
            <View style={[
                styles.navigationBar,
                { justifyContent: 'space-between' }
            ]}>
                <View style={styles.navigationBar}>
                    <TouchableOpacity
                        style={styles.return}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={back}
                            style={[styles.icon, { tintColor: COLORS.white }]}
                        />
                    </TouchableOpacity>
                    <Text
                        style={styles.header}
                        ellipsizeMode='clip'
                        numberOfLines={1}
                    >
                        Thông tin Giao dịch
                    </Text>
                </View>
                <View
                    style={styles.navigationBar}
                >
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleDelete}
                    >
                        <Image
                            source={delete_icon}
                            style={[styles.icon, { tintColor: COLORS.white }]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleEdit}
                    >
                        <Image
                            source={edit}
                            style={[styles.icon, { tintColor: COLORS.white }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.detailContainer}>
                <View style={styles.elementContainer}>
                    <Image source={calendar} style={styles.icon} />
                    <View style={{ margin: 5 }}>
                        <Text style={styles.elementText}>Thời gian:</Text>
                        <Text style={styles.detailText}>{date.toFormat('DDDD')}</Text>
                    </View>
                </View>

                <View style={styles.elementContainer}>
                    <Image source={wallet} style={styles.icon} />
                    <View style={{ margin: 5 }}>
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
                </View>

                <View style={styles.elementContainer}>
                    <Image source={category} style={styles.icon} />
                    <View style={{ margin: 5 }}>
                        <Text style={styles.elementText}>Danh mục:</Text>
                        <Text style={[
                            styles.detailText,
                            {
                                color: (data.type === 'expense') ?
                                    COLORS.red :
                                    COLORS.green
                            }
                        ]}>{data.name}</Text>
                    </View>
                </View>

                <View style={styles.elementContainer}>
                    <Image source={paragrapgh} style={styles.icon} />
                    <View style={{ margin: 5 }}>
                        <Text style={styles.elementText}>Ghi chú:</Text>
                        <ScrollView>
                            <Text style={styles.detailText}>{data.description}</Text>
                        </ScrollView>
                    </View>
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
        left: 7,
        alignSelf: 'flex-start',
        paddingVertical: 24
    },
    returnIcon: {
        width: 20,
        height: 20,
    },
    navigationBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.blue
    },
    header: {
        marginTop: 22,
        marginHorizontal: 7,
        fontSize: 20,
        color: COLORS.white,
        alignSelf: 'flex-start',
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
    },
    detailContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 20
    },
    elementContainer: {
        width: SIZES.width,
        padding: 10,
        flexDirection: 'row'
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