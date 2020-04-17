import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, ScrollView, Linking, Dimensions, Vibration } from 'react-native';
import { colors } from './../../config/colors'
import Header from './../../components/Header'
import CheckBox from './../../components/Checkbox'
import Icon from "react-native-dynamic-vector-icons";
import * as gameActions from './../../actions/gameActions'
import { bannerId } from './../../config/helpers';
import Sound from 'react-native-sound';
import Share from 'react-native-share';
// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const DEVICE_WIDTH = Dimensions.get('window').width;

/******* Banner ***********/
import firebase from 'react-native-firebase';
const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();
request.addKeyword('MathGames');
request.addKeyword('MathGamesFun');

class SettingScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            themeSelector: true
        }
        this.correctSound = new Sound('correct.wav');
    }

    changeSetting(key, value) {
        if (key == 'soundOn' && !!value) {
            this.correctSound.play()
        } else if (key == 'vibration' && !!value) {
            Vibration.vibrate()
        }
        this.props.gameAction.changeSettingValue(key, value)
    }

    shareGame() {
        Share.open({
            url: 'https://play.google.com/store/apps/details?id=com.ravisojitra.mathgames',
            title: "Play this game, It's so cool!",
            message: "Play this game, It's so cool!",
        })
            .then((res) => { console.log(res) })
            .catch((err) => { err && console.log(err); });
    }

    rateGame(){
        Linking.openURL('https://play.google.com/store/apps/details?id=com.ravisojitra.mathgames')
    }

    render() {
        let themeColor = this.props.themeColor || { primaryColor: "#555D50", secondaryColor: "#6C7665" }//colors[Math.floor(Math.random() * colors.length)];
        return (
            <View style={{ flex: 1, backgroundColor: themeColor.secondaryColor }}>
                <StatusBar backgroundColor={themeColor.primaryColor} animated />
                <Header
                    {...this.props}
                    rightFn={() => this.props.navigation.navigate('Settings')}
                    showBack
                    showRight={false}
                    backgroundColor={themeColor.primaryColor}
                />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: themeColor.secondaryColor }}>
                    <Banner
                        unitId={bannerId}
                        size={"SMART_BANNER"}
                        request={request.build()}
                        onAdLoaded={() => {
                            console.log('Advert loaded');
                        }}
                        onAdFailedToLoad={(e) => {
                            console.log("error => " + JSON.stringify(e))
                        }}
                    />
                    <View style={styles.singleSetting}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon
                                name={this.props.soundOn ? "volume-2" : 'volume-off'}
                                type="SimpleLineIcons"
                                size={30}
                                color={"white"}
                                styke={{ opacity: 0.8 }}
                            />
                            <Text style={styles.label}>Sound effects</Text>
                        </View>
                        <CheckBox
                            isChecked={this.props.soundOn}
                            onPress={(soundOn) => this.changeSetting('soundOn', soundOn)}
                            size={25}
                        />
                    </View>

                    <View style={styles.singleSetting}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon
                                name={this.props.vibration ? "vibrate" : 'vibrate-off'}
                                type="MaterialCommunityIcons"
                                size={30}
                                color={"white"}
                                styke={{ opacity: 0.8 }}
                            />
                            <Text style={styles.label}>Vibration</Text>
                        </View>
                        <CheckBox
                            isChecked={this.props.vibration}
                            onPress={(vibration) => this.changeSetting('vibration', vibration)}
                            size={25}
                        />
                    </View>

                    <View style={[styles.singleSettingVerticle,]}>
                        <View style={[styles.singleSetting, { padding: 0, borderBottomWidth: 0, paddingRight: 20 }]}>
                            <TouchableOpacity onPress={() => this.setState({ themeSelector: !this.state.themeSelector })} style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                <Icon
                                    name={'color-lens'}
                                    type="MaterialIcons"
                                    size={30}
                                    color={"white"}
                                    styke={{ opacity: 0.8 }}
                                />
                                <Text style={styles.label}>Change Theme</Text>

                            </TouchableOpacity>
                            {
                                this.state.themeSelector &&
                                <Icon
                                    name={'md-close'}
                                    type="Ionicons"
                                    size={30}
                                    color={"white"}
                                    styke={{ opacity: 0.8 }}
                                    onPress={() => this.setState({ themeSelector: false })}
                                />
                            }

                        </View>
                        {
                            this.state.themeSelector &&
                            <View style={{ marginTop: 15, flexWrap: 'wrap', flex: 1, flexDirection: 'row' }}>
                                {
                                    colors.map((color, index) => {
                                        let hw = (DEVICE_WIDTH - 30 - 26) / 6;
                                        return (
                                            <TouchableOpacity
                                                key={color.primaryColor}
                                                style={{ position: 'relative', borderWidth: 1, elevation: 5, marginRight: ((index + 1) % 3 == 0) ? 0 : 10, marginBottom: 10, }}
                                                onPress={() => this.changeSetting('themeColor', color)}
                                            >
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ backgroundColor: color.primaryColor, width: hw, height: hw }}></View>
                                                    <View style={{ backgroundColor: color.secondaryColor, width: hw, height: hw }}></View>
                                                </View>
                                                {
                                                    this.props.themeColor.primaryColor == color.primaryColor &&
                                                    <View style={{ position: 'absolute', top: hw - 40, left: hw - 15, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Icon
                                                            name={'checkcircleo'}
                                                            type="AntDesign"
                                                            size={30}
                                                            color={"white"}
                                                            styke={{ opacity: 0.8 }}
                                                        />
                                                    </View>
                                                }

                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        }
                    </View>

                    <TouchableOpacity style={styles.singleSetting} onPress={() => alert("Coming soon!")}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon
                                name={'language'}
                                type="FontAwesome"
                                size={30}
                                color={"white"}
                                styke={{ opacity: 0.8 }}
                            />
                            <Text style={styles.label}>Language</Text>
                        </View>
                    </TouchableOpacity>

                    {/* <View style={styles.singleSetting} >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={require('./../../assets/images/no-ads.png')}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text style={styles.label}>Remove Ads</Text>
                        </View>
                    </View> */}

                    <TouchableOpacity style={styles.singleSetting} onPress={() => this.shareGame()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon
                                name={'sharealt'}
                                type="AntDesign"
                                size={30}
                                color={"white"}
                                styke={{ opacity: 0.8 }}
                            />
                            <Text style={styles.label}>Share</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.singleSetting} onPress={() => this.rateGame()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon
                                name={'star'}
                                type="SimpleLineIcons"
                                size={30}
                                color={"white"}
                                styke={{ opacity: 0.8 }}
                            />
                            <Text style={styles.label}>Rate</Text>
                        </View>
                    </TouchableOpacity>

                    <Banner
                        unitId={bannerId}
                        size={"SMART_BANNER"}
                        request={request.build()}
                        onAdLoaded={() => {
                            console.log('Advert loaded');
                        }}
                        onAdFailedToLoad={(e) => {
                            console.log("error => " + JSON.stringify(e))
                        }}
                    />
                </ScrollView>

            </View>
        );
    }
}

function mapStateToProps(state) {
    console.log("state => ", state)
    return {
        themeColor: state.game && state.game.themeColor,
        soundOn: state.game && state.game.soundOn,
        vibration: state.game && state.game.vibration,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        gameAction: bindActionCreators(gameActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);

const styles = StyleSheet.create({
    label: {
        color: 'white', marginLeft: 15, fontFamily: 'toon-regular', letterSpacing: 1, fontSize: 20
    },
    singleSetting: {
        opacity: 0.8,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'white', padding: 15
    },
    singleSettingVerticle: {
        flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: 'white', padding: 15, flex: 1
    }
})