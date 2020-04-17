import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from "react-native-dynamic-vector-icons";

export default class Header extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        let iconCategories = {
            "setting": { name: "gear", type: "Octicons" }
        }
        return (
            <View style={[styles.header, { backgroundColor: this.props.backgroundColor }]}>
                {
                    this.props.showBack ?
                        <Icon
                            name="arrowleft"
                            type="AntDesign"
                            size={30}
                            color="white"
                            onPress={() => { this.props.navigation.goBack() }}
                        />
                        :
                        <View></View>
                }

                {
                    this.props.showRight &&
                    <Icon
                        name={iconCategories[this.props.iconType].name}
                        type={iconCategories[this.props.iconType].type}
                        size={30}
                        color={"white"}
                        onPress={() => { this.props.rightFn() }}
                    />
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        textAlign: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 0,
    }
})