import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    TouchableHighlight,
} from 'react-native'
import { COLORS } from '../../constants/theme'

const Chip = (props) => {

    const [isPressed, setPressed] = useState(false)

    const handlePress = () => {
        setPressed(!isPressed)
        props.onPress();
    }

    return (
        <TouchableHighlight
            style={[
                styles.chip,
                {
                    backgroundColor: isPressed ? props.color : 'transparent',
                    borderColor: props.color
                }
            ]}
            onPress={handlePress}
            underlayColor={COLORS.gray}
        >
            <Text
                style={{ color: isPressed ? COLORS.white : props.color }}
            >
                {props.tittle}
            </Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    chip: {
        height: 40,
        width: 100,
        marginVertical: 5,
        marginHorizontal: 2,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    }
})

export default Chip;