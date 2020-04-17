import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions, StyleSheet, ScrollView, Animated } from 'react-native';
import { colors } from './../../config/colors'
import Header from './../../components/Header';

import Icon from "react-native-dynamic-vector-icons";
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';

import { bannerId, interstialId } from './../../config/helpers'
// REDUX
import { connect } from 'react-redux';
let modeWidth = (DEVICE_WIDTH - 30 - 15) / 2;
let fullWidth = (DEVICE_WIDTH - 30);

// Advertisement
import firebase from 'react-native-firebase';

/******* Banner ***********/
const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

request.addKeyword('MathGames');
request.addKeyword('MathGamesFun');

/******* interstitial ***********/
const advert = firebase.admob().interstitial(interstialId);

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameOptionSelector: false,
            selectedSigns: [],
            selectedDifficulty: null,
            answerDuration: 1,
            gameDuration: null,
            currentGameMode: null,
            optionMode: null,
            orderMode: null,
            gridSize: null
        }
        this.routes = {
            'infinity': 'Game',
            'quickMath': 'Game',
            'equation': 'Equation',
            'tap': 'Tap',
            'numberOrder': 'NumberOrder'
        }
    }

    componentDidMount() {
        advert.loadAd(request.build());
        advert.on('onAdLoaded', () => {
            console.log("ad loadeed");
            advert.show();
        });
        advert.on('onAdFailedToLoad', () => {
            console.log('onAdFailedToLoad ');
        });
    }

    startGame(gameMode) {
        if (['infinity', 'quickMath', 'equation', 'tap', 'numberOrder'].indexOf(gameMode) >= 0) {
            this.setState({ gameOptionSelector: true, currentGameMode: gameMode })
        } else {
            this.setState({ currentGameMode: gameMode }, () => {
                this.navigateToGame(gameMode)
            });
        }
    }

    navigateToGame(route) {
        let { currentGameMode, selectedSigns, selectedDifficulty, answerDuration, gameDuration, optionMode, orderMode, gridSize } = this.state;
        if (!currentGameMode) {
            return true
        }
        this.setState({
            gameOptionSelector: false
        }, () => {
            let defaultSigns = ['+', '-', '*', '/'];
            if (this.state.currentGameMode != 'equation') {
                defaultSigns.push('%')
            }

            this.props.navigation.navigate(this.routes[this.state.currentGameMode], {
                currentGameMode,
                selectedSigns: selectedSigns.length > 0 ? selectedSigns : defaultSigns,
                min: 2,
                max: selectedDifficulty || 9,
                answerDuration: answerDuration == 1 ? 10 : answerDuration,
                gameDuration,
                optionMode,
                orderMode: orderMode || 'asc',
                gridSize: gridSize || 3
            })
        })
    }

    toggleSign(sign) {
        let selectedSigns = [...this.state.selectedSigns];
        let signIndex = selectedSigns.indexOf(sign);
        if (signIndex >= 0) {
            selectedSigns.splice(signIndex, 1);
        } else {
            selectedSigns.push(sign);
        }
        this.setState({ selectedSigns })
    }

    render() {
        let { themeColor } = this.props;
        let { selectedSigns, selectedDifficulty, answerDuration, optionMode, gameDuration, orderMode, gridSize } = this.state;
        themeColor = themeColor || colors[Math.floor(Math.random() * colors.length)];

        return (
            <View style={{ flex: 1, backgroundColor: themeColor.primaryColor }}>
                <StatusBar backgroundColor={themeColor.primaryColor} animated />
                <Header
                    {...this.props}
                    rightFn={() => this.props.navigation.navigate('Settings')}
                    showBack={false}
                    showRight
                    iconType={"setting"}
                />

                <ScrollView contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row', paddingHorizontal: 15 }}>

                    <TouchableOpacity
                        onPress={() => { this.startGame('infinity') }}
                        style={[styles.singleMode, { backgroundColor: themeColor.secondaryColor, marginRight: 15, width: fullWidth }]}
                    >
                        <Icon
                            name="infinity"
                            type="MaterialCommunityIcons"
                            size={35}
                            color={"#fff"}
                            style={{ opacity: 0.8 }}
                        />
                        <Text style={styles.gameName}>Infinity </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { this.startGame('quickMath') }}
                        style={[styles.singleMode, { backgroundColor: themeColor.secondaryColor, marginRight: 15 }]}>
                        <Icon
                            name="timer-sand"
                            type="MaterialCommunityIcons"
                            size={35}
                            color="white"
                            style={{ opacity: 0.8 }}
                        />
                        <Text style={styles.gameName}>Quick Math</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.startGame('equation') }}
                        style={[styles.singleMode, { backgroundColor: themeColor.secondaryColor }]}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Icon
                                name="question"
                                type="AntDesign"
                                size={35}
                                color="white"
                                style={{ opacity: 0.8 }}
                            />
                            <Icon
                                name="plus"
                                type="AntDesign"
                                size={35}
                                color="white"
                                style={{ opacity: 0.8 }}
                            />
                            <Icon
                                name="question"
                                type="AntDesign"
                                size={35}
                                color="white"
                                style={{ opacity: 0.8 }}
                            />
                        </View>
                        <Text style={styles.gameName}>Equation </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.startGame('tap') }}
                        style={[styles.singleMode, { backgroundColor: themeColor.secondaryColor, marginRight: 15 }]}>
                        <Icon
                            name="cursor-default-click"
                            type="MaterialCommunityIcons"
                            size={40}
                            color="white"
                            style={{ opacity: 0.8 }}
                        />
                        <Text style={styles.gameName}>Tap X</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.startGame('numberOrder') }}
                        style={[styles.singleMode, { backgroundColor: themeColor.secondaryColor }]}>
                        <Icon
                            name="table-large"
                            type="MaterialCommunityIcons"
                            size={35}
                            color="white"
                            style={{ opacity: 0.8 }}
                        />
                        <Text style={styles.gameName}>Number Order</Text>
                    </TouchableOpacity>

                </ScrollView>

                <Banner
                    unitId={bannerId}
                    size={"SMART_BANNER"}
                    request={request.build()}
                    onAdLoaded={() => {
                        console.log('Advert loaded');
                    }}
                    onAdFailedToLoad={(e) => {
                        console.log("error => ", e)
                    }}
                />

                <Dialog
                    rounded={false}
                    visible={this.state.gameOptionSelector}
                    hasOverlay={true}
                    animationDuration={1}
                    onTouchOutside={() => {
                        this.setState({ selectedDifficulty: [], selectedSigns: [], answerDuration: 1, gameDuration: null, gameOptionSelector: false })
                    }}
                    dialogAnimation={
                        new SlideAnimation({
                            initialValue: 0, // optional
                            animationDuration: 150, // optional
                            useNativeDriver: true, // optional
                        })
                    }
                    onHardwareBackPress={() => {
                        this.setState({ selectedDifficulty: [], selectedSigns: [], answerDuration: 1, gameDuration: null, gameOptionSelector: false })
                        return true;
                    }}
                    dialogStyle={[styles.customPopup, { backgroundColor: themeColor.primaryColor, position: 'relative' }]}
                >
                    <DialogContent style={styles.customPopupContent}>
                        <View style={styles.customPopupHeader}>
                            <TouchableOpacity
                                style={styles.buttonClose}
                                onPress={() => this.setState({ selectedDifficulty: [], selectedSigns: [], answerDuration: 1, gameDuration: null, gameOptionSelector: false })}>
                                <Text style={styles.titleLabel}>X</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.currentGameMode != 'tap' && this.state.currentGameMode != 'numberOrder' &&
                            <View style={styles.loginDialogContentInner}>
                                <Text style={styles.titleLabel}>Choose Signs</Text>
                                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => this.toggleSign('+')}
                                        style={[styles.signLabel, { backgroundColor: selectedSigns.indexOf('+') >= 0 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                        <Icon
                                            name="plus"
                                            type="AntDesign"
                                            size={35}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.toggleSign('-')}
                                        style={[styles.signLabel, { backgroundColor: selectedSigns.indexOf('-') >= 0 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                        <Icon
                                            name="minus"
                                            type="AntDesign"
                                            size={35}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.toggleSign('*')}
                                        style={[styles.signLabel, { backgroundColor: selectedSigns.indexOf('*') >= 0 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                        <Icon
                                            name="multiplication"
                                            type="MaterialCommunityIcons"
                                            size={35}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.toggleSign('/')}
                                        style={[styles.signLabel, { backgroundColor: selectedSigns.indexOf('/') >= 0 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                        <Icon
                                            name="division"
                                            type="MaterialCommunityIcons"
                                            size={35}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                    {
                                        (this.state.currentGameMode != 'equation' && this.state.currentGameMode != 'tap') &&
                                        <TouchableOpacity
                                            onPress={() => this.toggleSign('%')}
                                            style={[styles.signLabel, { backgroundColor: selectedSigns.indexOf('%') >= 0 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                            <Icon
                                                name="percent"
                                                type="MaterialCommunityIcons"
                                                size={30}
                                                color="white"
                                            />
                                        </TouchableOpacity>
                                    }

                                </View>
                            </View>
                        }
                        {
                            this.state.currentGameMode != 'numberOrder' &&
                            <>
                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.titleLabel}>Choose Difficulty</Text>
                                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ selectedDifficulty: 9 })}
                                            style={[styles.signLabel, { backgroundColor: selectedDifficulty == 9 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                            <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>1</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ selectedDifficulty: 99 })}
                                            style={[styles.signLabel, { backgroundColor: selectedDifficulty == 99 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                            <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>11</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ selectedDifficulty: 999 })}
                                            style={[styles.signLabel, { backgroundColor: selectedDifficulty == 999 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                            <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>111</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ selectedDifficulty: 9999 })}
                                            style={[styles.signLabel, { backgroundColor: selectedDifficulty == 9999 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                            <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>1111</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.titleLabel}>Answer Time (In Second)</Text>
                                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ answerDuration: 5 })}
                                            style={[styles.signLabel, { backgroundColor: answerDuration == 5 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                            <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>5</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ answerDuration: 10 })}
                                            style={[styles.signLabel, { backgroundColor: answerDuration == 10 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                            <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>10</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ answerDuration: 15 })}
                                            style={[styles.signLabel, { backgroundColor: answerDuration == 15 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                            <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>15</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ answerDuration: 30 })}
                                            style={[styles.signLabel, { backgroundColor: answerDuration == 30 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                            <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>30</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        }

                        {
                            this.state.currentGameMode == 'tap' &&
                            <View style={{ marginTop: 15 }}>
                                <Text style={styles.titleLabel}>Option Mode</Text>
                                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ optionMode: 'Equation' })}
                                        style={[styles.signLabel, { backgroundColor: optionMode == 'Equation' ? themeColor.secondaryColor : themeColor.primaryColor, flex: 1, marginRight: 30 }]}>
                                        <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>Equation</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ optionMode: 'Number' })}
                                        style={[styles.signLabel, { backgroundColor: optionMode == 'Number' ? themeColor.secondaryColor : themeColor.primaryColor, flex: 1 }]}>
                                        <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>Number</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        {
                            this.state.currentGameMode == 'numberOrder' ?
                                <>
                                    <View style={{ marginTop: 15 }}>
                                        <Text style={styles.titleLabel}>Number Selection</Text>
                                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => this.setState({ orderMode: 'asc' })}
                                                style={[styles.signLabel, { backgroundColor: orderMode == 'asc' ? themeColor.secondaryColor : themeColor.primaryColor, flex: 1, marginRight: 30 }]}>
                                                <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>Ascending</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => this.setState({ orderMode: 'desc' })}
                                                style={[styles.signLabel, { backgroundColor: orderMode == 'desc' ? themeColor.secondaryColor : themeColor.primaryColor, flex: 1 }]}>
                                                <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>Descending</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 15 }}>
                                        <Text style={styles.titleLabel}>Table size</Text>
                                        <View style={styles.gridWrapper} >
                                            {
                                                [3, 4, 5, 6, 7, 8, 9, 10].map(gridValue => {
                                                    let backgroundColor = gridValue == gridSize ? themeColor.secondaryColor : themeColor.primaryColor;
                                                    return (
                                                        < TouchableOpacity
                                                            onPress={() => this.setState({ gridSize: gridValue })}
                                                            style={[styles.gridOption, { backgroundColor }]}
                                                            key={`${gridValue}x${gridValue}`}
                                                        >
                                                            <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>{gridValue} X {gridValue}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </>
                                :
                                null
                        }

                        {
                            this.state.currentGameMode == 'infinity' &&
                            <View style={{ marginTop: 15 }}>
                                <Text style={styles.titleLabel}>Game Duration (In minute)</Text>
                                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ gameDuration: 1 })}
                                        style={[styles.signLabel, { backgroundColor: gameDuration == 1 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                        <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>1</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ gameDuration: 3 })}
                                        style={[styles.signLabel, { backgroundColor: gameDuration == 3 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                        <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>3</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ gameDuration: 5 })}
                                        style={[styles.signLabel, { backgroundColor: gameDuration == 5 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                        <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>5</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ gameDuration: 10 })}
                                        style={[styles.signLabel, { backgroundColor: gameDuration == 10 ? themeColor.secondaryColor : themeColor.primaryColor, }]}>
                                        <Text style={{ fontFamily: 'toon-extra-bold', color: 'white', fontSize: 16 }}>10</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        <TouchableOpacity
                            style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: themeColor.secondaryColor, marginTop: 20 }}
                            onPress={() => this.navigateToGame()}
                        >
                            <Text style={styles.playButton}>Start</Text>
                        </TouchableOpacity>

                    </DialogContent>
                </Dialog>


            </View >
        );
    }
}

function mapStateToProps(state) {
    return {
        themeColor: state.game && state.game.themeColor
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // userAction: bindActionCreators(userActions, dispatch),
        // mapAction: bindActionCreators(mapActions, dispatch),
    };
}

export default connect(mapStateToProps, null)(HomeScreen);

const styles = StyleSheet.create({
    titleLabel: {
        color: '#eee', fontFamily: 'toon-bold', letterSpacing: 1, fontSize: 20
    },
    gameName: { opacity: 0.8, color: 'white', fontFamily: 'toon-bold', letterSpacing: 1, fontSize: 22, marginTop: 10, textAlign: 'center' },
    playButton: {
        color: '#eee', fontFamily: 'toon-bold', letterSpacing: 1, fontSize: 20,
        paddingHorizontal: 20, paddingVertical: 10
    },
    singleMode: {
        justifyContent: 'center', alignItems: 'center', minHeight: 120, borderWidth: 2, borderRadius: 10, borderColor: '#fff', elevation: 8, marginBottom: 15, width: modeWidth, height: modeWidth
    },
    gridWrapper: {
        marginTop: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    gridOption: {
        marginRight: 10,
        marginBottom: 10,
        height: 50,
        minWidth: (DEVICE_WIDTH - 75) / 3,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    customPopupContent: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    customPopupHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    customPopupHeaderTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
        color: '#333333',
    },
    buttonClose: {
        width: 50,
        height: 30,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10
    },
    buttonCloseIcon: {
        color: '#BDBDBD',
        fontSize: 24,
    },
    signLabel: { height: 50, width: (DEVICE_WIDTH - 30 - 45) / 5, borderWidth: 1, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
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