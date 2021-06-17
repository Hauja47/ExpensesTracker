import React from 'react';
import Dialog from "react-native-dialog";
import {
    Text,
    StyleSheet
} from 'react-native'
import { useDispatch } from 'react-redux';

import { FONTS } from '../../constants/theme';

const EditAmountDialog = (props) => {

    const dispatch = useDispatch()

    const [amount, setAmount] = React.useState()

    return (
        <View>
            <Dialog.Container visible={true}>
                <Dialog.Tittle>Thay đổi số dư</Dialog.Tittle>
                <Dialog.Description>Nhập số dư mới</Dialog.Description>
                <Dialog.Input
                    style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder="Số tiền"
                    placeholderTextColor={COLORS.darkgray}
                    returnKeyType='next'
                    onChangeText={(amount) => { setAmount(amount) }}
                    blurOnSubmit={false}
                    keyboardType='number-pad'
                    value={value}
                    numberOfLines={1}
                />
            </Dialog.Container>
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        ...FONTS.h2,
        height: 50,
        margin: 10,
        color: 'black',
        flex: 1,
    }
})

export default EditAmountDialog;