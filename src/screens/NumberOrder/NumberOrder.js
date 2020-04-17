import React from 'react';
import { View, Dimensions, StatusBar, Text, TouchableOpacity, Vibration } from 'react-native';
import styles from './NumberOrder.styles';
import GameOverPopup from '../../components/GameOverPopup';
import Icon from "react-native-dynamic-vector-icons";
import { shuffleArray, bannerId, interstialId } from '../../config/helpers';
import { NavigationActions, StackActions } from 'react-navigation';
import Sound from 'react-native-sound';

const DEVICE_WIDTH = Dimensions.get('window').width;

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../../actions/gameActions'

// Advertisement
import firebase from 'react-native-firebase';
/******* Banner ***********/

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

/******* interstitial ***********/
const advert = firebase.admob().interstitial(interstialId);

request.addKeyword('MathGames');
request.addKeyword('MathGamesFun');
class NumberOrder extends React.Component {

    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        const { gridSize, orderMode } = params;

        this.defState = {
            progress: 0,
            currentProgress: 0,
            hasGameStarted: false,
            gameStartCount: 3,
            gameOver: false,
            gameLife: 3,
            tableData: [],
            currentNumber: orderMode == 'asc' ? 0 : (gridSize * gridSize) + 1,
            orderMode,
            gameCompleted: false
        }
        this.state = {
            ...this.defState
        }

        this.wrongSound = new Sound('wrong.wav');
        this.correctSound = new Sound('correct.wav');
        this.gameOverSound = new Sound('gameover.wav');
    }

    componentWillMount() {
        this.generateTable()
    }

    componentDidMount() {
        this.setupGame();
    }

    generateTable() {
        const { params } = this.props.navigation.state;
        const { gridSize } = params;

        let tableData = Array(gridSize * gridSize).fill('').map((data, index) => {
            return (index + 1)
        });
        tableData = shuffleArray(tableData);
        this.setState({ tableData });
    }

    setupGame() {
        this.gameStartInterval = setInterval(() => {
            if (this.state.gameStartCount == 1) {
                clearInterval(this.gameStartInterval);
                this.setState({ progress: 100, hasGameStarted: true });
            } else {
                this.setState({ gameStartCount: this.state.gameStartCount - 1 })
            }
        }, 1000);

        setTimeout(() => {
            let startCount = +new Date;
            this.questionInterval = setInterval(() => {
                this.setState({ currentProgress: +new Date - startCount });
            }, 1000);
        }, 3000);
    }

    formatTimeString(time) {
        let msecs = time % 1000;

        let seconds = Math.floor(time / 1000);
        let minutes = Math.floor(time / 60000);
        let hours = Math.floor(time / 3600000);
        seconds = seconds - minutes * 60;
        minutes = minutes - hours * 60;

        let formattedMinutes = `0${minutes}`.slice(-2);
        let formattedSeconds = `0${seconds}`.slice(-2);
        let formattedMSec = `0${msecs}`.slice(-2);

        let fullTime = `${formattedMinutes}:${formattedSeconds}:${formattedMSec}`;
        return formattedMinutes == '00' ? `${formattedSeconds}:${formattedMSec}` : fullTime
    }

    gameCompleted(progressTime) {
        clearInterval(this.questionInterval);
        this.setState({ gameOver: true, gameCompleted: true }, () => {
            this.updateBestScore(progressTime)
        })
    }

    checkOption(option) {
        const { params } = this.props.navigation.state;
        const { gridSize, orderMode } = params;
        let cellSize = gridSize * gridSize;
        let secondLastNumber = orderMode == 'asc' ? cellSize - 1 : 2;

        let currentNumber = this.state.currentNumber;
        currentNumber = orderMode == 'asc' ? currentNumber + 1 : currentNumber - 1;

        if (this.state.currentNumber == secondLastNumber && currentNumber == option) {
            if (this.props.soundOn) {
                this.correctSound.play();
            }
            this.gameCompleted(this.state.currentProgress)
        } else {
            if (currentNumber == option) {
                this.setState({ currentNumber: option })
            } else {

                if (this.props.vibration) {
                    Vibration.vibrate()
                }

                this.setState({ gameLife: this.state.gameLife - 1 }, () => {
                    if (this.state.gameLife == 0) {
                        this.gameOver(this.state.currentProgress);
                    } else {
                        if (this.props.soundOn) {
                            this.wrongSound.play();
                        }
                    }
                })


            }
        }

    }

    updateBestScore(currentProgress) {
        const { params } = this.props.navigation.state;
        let prevBestScore = this.props.bestScores && this.props.bestScores[params.currentGameMode] || 0;
        if (currentProgress < prevBestScore) {
            this.props.gameAction.updateBestScore(params.currentGameMode, currentProgress)
        }
    }

    gameOver(currentProgress) {
        clearInterval(this.questionInterval);
        if (this.props.soundOn) {
            this.gameOverSound.play();
        }

        this.setState({ gameOver: true, gameCompleted: false }, () => {
            this.displayAds()
        });
    }

    navigateToHome() {
        this.setState({ gameOver: false }, () => {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })],
            });
            this.props.navigation.dispatch(resetAction);
        })
    }

    restartGame() {
        this.setState({ gameOver: false }, () => {
            setTimeout(() => {
                this.setState({ ...this.defState }, () => {
                    this.generateTable()
                    this.setupGame()
                })
            }, 200);
        })
    }

    displayAds() {
        advert.loadAd(request.build());
        advert.on('onAdLoaded', () => {
            console.log("ad loadeed");
            advert.show();
        });
        advert.on('onAdFailedToLoad', (err) => {
            console.log('onAdFailedToLoad ');
            console.log(JSON.stringify(err))
        });
    }

    render() {
        const { themeColor } = this.props;
        const { params } = this.props.navigation.state;
        const { hasGameStarted, tableData, currentNumber, gameCompleted, gameOver, currentProgress, gameStartCount } = this.state;
        let prevBestScore = this.props.bestScores && this.props.bestScores[params.currentGameMode] || 0;
        let formattedProgress = this.formatTimeString(currentProgress);

        let numberToFind = params.orderMode == 'asc' ? currentNumber + 1 : currentNumber - 1;

        if (!hasGameStarted) {
            return (
                <View style={{ flex: 1, backgroundColor: themeColor.primaryColor, justifyContent: 'center', alignItems: 'center' }}>
                    <StatusBar backgroundColor={themeColor.primaryColor} animated />
                    <Text style={styles.gameStartCount}>{gameStartCount}</Text>
                </View>
            )
        }

        let cellWidth = (DEVICE_WIDTH - 3 - (params.gridSize * 2)) / params.gridSize;
        let cellFontSize = params.gridSize < 5 ? 26 : params.gridSize < 7 ? 22 : 16
        return (
            <View style={{ flex: 1, backgroundColor: themeColor.primaryColor, paddingBottom: 30 }}>
                <StatusBar backgroundColor={themeColor.primaryColor} animated />
                <View style={styles.header}>

                    <View style={styles.headerLabelContainer}>
                        <Icon
                            name="clock"
                            type="SimpleLineIcons"
                            size={30}
                            color="white"
                        />
                        <Text style={styles.headerLabel}>{formattedProgress}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {
                            Array(this.state.gameLife).fill('').map((a, index) => {
                                return (
                                    <Icon
                                        name="heart"
                                        type="AntDesign"
                                        size={30}
                                        color={themeColor.secondaryColor}
                                        style={{ marginRight: 5 }}
                                        key={`heart_${index}`}
                                    />
                                )
                            })
                        }
                        {
                            Array(3 - this.state.gameLife).fill('').map(a => {
                                return (
                                    <Icon
                                        name="hearto"
                                        type="AntDesign"
                                        size={30}
                                        color={themeColor.secondaryColor}
                                        style={{ marginRight: 5 }}
                                    />
                                )
                            })
                        }

                    </View>
                </View>

                <View style={{ paddingVertical: 20, paddingHorizontal: 0, alignSelf: 'center', justifyContent: 'center', flex: 1 }}>

                    <View style={{ flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', backgroundColor: 'transparent', paddingLeft: 2, paddingVertical: 2 }}>
                        {
                            tableData.map((option) => {
                                return (
                                    <TouchableOpacity
                                        key={`cell_${option}`}
                                        onPress={() => this.checkOption(option)}
                                        style={{ width: cellWidth, height: cellWidth, backgroundColor: themeColor.secondaryColor, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginBottom: 2, marginRight: 2 }}>
                                        <Text style={[styles.gameDigit, { fontSize: cellFontSize, textAlign: 'center' }]}>{option}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
                <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                    <Text style={styles.instruction}>Find number {numberToFind}</Text>
                </View>
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
                <GameOverPopup
                    visible={gameOver}
                    gameScore={this.formatTimeString(currentProgress)}
                    bestScore={this.formatTimeString(Math.min(prevBestScore, currentProgress))}
                    showBestScoreDirect={true}
                    navigateToHome={() => this.navigateToHome()}
                    restartGame={() => this.restartGame()}
                    popupTitle={gameCompleted ? 'Congrats!' : 'Game Over'}
                    {...this.props}
                />

            </View>
        )

    }
}

function mapStateToProps(state) {
    return {
        themeColor: state.game && state.game.themeColor,
        bestScores: state.game && state.game.bestScores,
        soundOn: state.game && state.game.soundOn,
        vibration: state.game && state.game.vibration,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        gameAction: bindActionCreators(gameActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NumberOrder);