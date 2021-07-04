import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import { useSelector } from 'react-redux'

const MyCheckBox = (props) => {

    const [checked, setCheck] = useState(false);
    const { categories } = useSelector(state => state.categoriesReducer)

    useEffect(() => {
        setCheck(false)
    }, [categories])

    const handlePress = () => {
        setCheck(!checked);
        props.onPress(props.id);
    }

    return (
        <CheckBox
            key={props.id}
            title={props.title}
            checked={checked}
            onPress={handlePress}
        />
    )
}

const styles = StyleSheet.create({

})

export default MyCheckBox;