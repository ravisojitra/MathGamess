import React from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import Icon from "react-native-dynamic-vector-icons";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class GameOverPopup extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const { themeColor, gameScore, bestScore } = this.props;
        return (
            <Dialog
                rounded={false}
                visible={this.props.visible}
                hasOverlay={true}
                animationDuration={1}
                onTouchOutside={() => {
                    return false
                }}
                dialogAnimation={
                    new SlideAnimation({
                        initialValue: 0, // optional
                        animationDuration: 150, // optional
                        useNativeDriver: true, // optional
                    })
                }
                onHardwareBackPress={() => {
                    return true;
                }}
                dialogStyle={[styles.customPopup, { backgroundColor: themeColor.primaryColor, position: 'relative' }]}
            >
                <DialogContent style={styles.customPopupContent}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.gameOverButton}>{this.props.popupTitle || 'Game Over'}</Text>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Text style={styles.scoreLabel}>Current Score</Text>
                            <View
                                style={[styles.scoreBtn, { backgroundColor: themeColor.secondaryColor }]}
                            >
                                <Text style={styles.gameOverButton}>{gameScore}</Text>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={styles.scoreLabel}>Best Score</Text>
                            <View
                                style={[styles.scoreBtn, { backgroundColor: themeColor.secondaryColor }]}
                            >
                                {
                                    this.props.showBestScoreDirect ?

                                        <Text style={styles.gameOverButton}>{bestScore}</Text>
                                        :
                                        <Text style={styles.gameOverButton}>{Math.max(gameScore, bestScore)}</Text>
                                }
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                            <TouchableOpacity
                                style={[styles.popupBtn, { backgroundColor: themeColor.secondaryColor, marginRight: 50 }]}
                                onPress={() => this.props.navigateToHome()}
                                activeOpacity={1}
                            >
                                <Icon
                                    name="home-outline"
                                    type="MaterialCommunityIcons"
                                    size={35}
                                    color="white"
                                    style={{ opacity: 0.8 }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.popupBtn, { backgroundColor: themeColor.secondaryColor }]}
                                onPress={() => this.props.restartGame()}
                                activeOpacity={1}
                            >
                                <Icon
                                    name="restart"
                                    type="MaterialCommunityIcons"
                                    size={35}
                                    color="white"
                                    style={{ opacity: 0.8 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
        )
    }
}

const styles = StyleSheet.create({
    gameOverButton: {
        color: '#eee', fontFamily: 'toon-bold', letterSpacing: 1, fontSize: 30,
        paddingHorizontal: 20, paddingVertical: 10
    },
    scoreLabel: {
        color: '#eee', fontFamily: 'toon-bold', letterSpacing: 1, fontSize: 20, paddingVertical: 10,
    },
    popupBtn: {
        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: 20, padding: 15, elevation: 8,flex:1
    },
    scoreBtn: {
        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', height: 50
    },
    customPopupContent: {
        padding: 20
    },
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