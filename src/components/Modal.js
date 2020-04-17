import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

import Dialog, { SlideAnimation } from 'react-native-popup-dialog';

export default class Modal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { themeColor } = this.props;
        return (
            <Dialog
                rounded={false}
                visible={this.props.visible}
                // hasOverlay={true}
                animationDuration={1}
                onTouchOutside={() => {
                    this.props.onClose()
                }}
                dialogAnimation={
                    new SlideAnimation({
                        initialValue: 0, // optional
                        animationDuration: 150, // optional
                        useNativeDriver: true, // optional
                    })
                }
                onHardwareBackPress={() => {
                    this.props.onClose()
                    return true;
                }}
                dialogStyle={[styles.customPopup, { backgroundColor: themeColor.primaryColor, position: 'relative' }]}
            >
                {this.props.children}
            </Dialog>
        )
    }
}

const styles = StyleSheet.create({
    customPopup: {
        width: DEVICE_WIDTH - 20,
        padding: 0,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        maxHeight: DEVICE_HEIGHT - 20,
        borderRadius: 5
    }
})