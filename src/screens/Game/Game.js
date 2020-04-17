import React from 'react';
import { View, Dimensions, StatusBar, Text, TouchableOpacity, Vibration } from 'react-native'
import styles from './Game.styles'
import ProgressBar from './../../components/ProgressBar';
import GameOverPopup from './../../components/GameOverPopup';
import Icon from "react-native-dynamic-vector-icons";
import { randomFromArray, generateRandomOptions, randomFromMinMax, shuffleArray, bannerId, interstialId, displayGameMinsFromSeconds } from './../../config/helpers'
import { NavigationActions, StackActions } from 'react-navigation';
import Sound from 'react-native-sound';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from './../../actions/gameActions'

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

class Game extends React.Component {

    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        this.defState = {
            progress: 0,
            currentProgress: 0,
            hasGameStarted: false,
            gameStartCount: 3,
            gameScore: 0,
            gameOver: false,
            currentGameTime: params.gameDuration * 10,
            answerDuration: params.answerDuration,
            questionData: {
                firstDigit: null,
                lastDigit: null,
                answer: null,
                options: [null, null, null],
                sign: null
            },
            gameTime: `0${params.gameDuration}`.slice(0, -2) + `:00`
        }
        this.state = {
            ...this.defState
        }

        this.wrongSound = new Sound('wrong.wav');
        this.correctSound = new Sound('correct.wav');
        this.gameOverSound = new Sound('gameover.wav');
    }

    componentWillMount() {
        this.generateQuestion()
    }

    componentDidMount() {
        this.setupGame();
    }

    setupGame() {
        const { params } = this.props.navigation.state;
        if (params) {

            setTimeout(() => {

                this.setState({ progress: 100, hasGameStarted: true }, () => {
                    this.questionInterval = setInterval(() => {
                        if (this.state.currentProgress == params.answerDuration) {
                            if (params.currentGameMode == 'infinity') {
                                if (this.state.currentGameTime > 0) {
                                    this.generateQuestion();
                                } else if (this.state.currentGameTime <= 0) {
                                    this.gameOver();
                                }
                            } else {
                                this.gameOver();
                                clearInterval(this.questionInterval)
                            }
                        } else {
                            if (params.currentGameMode == 'infinity') {
                                if (this.state.currentGameTime <= 0) {
                                    this.gameOver();
                                    return
                                }
                            }
                            this.setState({ currentProgress: this.state.currentProgress + 1, currentGameTime: this.state.currentGameTime - 1 });
                        }

                    }, 1000);
                });

            }, 3000);

            this.gameStartInterval = setInterval(() => {
                if (this.state.gameStartCount == 0) {
                    clearInterval(this.gameStartInterval)
                } else {
                    this.setState({ gameStartCount: this.state.gameStartCount - 1 })
                }
            }, 1000);

        }
    }

    generateQuestion() {
        const { params } = this.props.navigation.state;

        if (params.currentGameMode == 'infinity' && this.state.currentGameTime <= 0) {
            this.gameOver()
            return
        }

        let { currentGameMode, selectedSigns, max, min, answerDuration } = params;
        let sign = randomFromArray(selectedSigns);

        let firstDigit = randomFromMinMax(min, max);
        let lastDigit = randomFromMinMax(min, max, sign, firstDigit);

        if (sign == '/') {
            [firstDigit, lastDigit] = [lastDigit, firstDigit]
        }
        if (sign == '%') {
            firstDigit *= 100;
        }

        let answer = eval(`${firstDigit}${sign}${lastDigit}`);

        if (sign == '%') {
            answer = (lastDigit * firstDigit) / (100);
        }

        answer = !Number.isInteger(answer) ? answer.toFixed(2) : answer

        let randomOptions = generateRandomOptions(answer, sign, min, max); //-1 , -
        let options = shuffleArray([...randomOptions, answer]);
        // let options = [...randomOptions, answer];

        let questionData = {
            firstDigit,
            lastDigit,
            answer,
            options,
            sign
        }

        this.setState({ progress: 0, answerDuration: 0, currentProgress: 0 }, () => {
            this.setState({ progress: 100, answerDuration: params.answerDuration, questionData })
        })
    }

    checkAnswer(selectedValue) {
        let { questionData } = this.state;
        if (selectedValue == questionData.answer) {
            this.rightOptionSelected()
        } else {
            this.wrongOptionSelected()
        }
    }

    rightOptionSelected() {
        let { gameScore } = this.state;
        const { params } = this.props.navigation.state;
        if (this.props.soundOn) {
            this.correctSound.play();
        }
        this.generateQuestion();

        if (params.currentGameMode == 'infinity' && this.state.currentGameTime <= 0) {
            return
        }
        this.setState({ progress: 0, currentProgress: 0, answerDuration: 0, gameScore: gameScore + 1 }, () => {
            this.setState({ progress: 100, currentProgress: 0, answerDuration: params.answerDuration })
        })
    }

    wrongOptionSelected() {
        const { params } = this.props.navigation.state;

        if (params.currentGameMode == 'infinity') {
            if (this.props.soundOn) {
                this.wrongSound.play();
            }
            if (this.props.vibration) {
                Vibration.vibrate()
            }
            return
        }
        this.gameOver()
    }

    gameOver() {
        const { params } = this.props.navigation.state;
        clearInterval(this.questionInterval);
        if (this.props.soundOn) {
            this.gameOverSound.play();
        }

        this.setState({ gameOver: true, progress: 0, answerDuration: 0, currentProgress: 0 }, () => {
            let prevBestScore = this.props.bestScores && this.props.bestScores[params.currentGameMode] || 0;
            if (this.state.gameScore > prevBestScore) {
                this.props.gameAction.updateBestScore(params.currentGameMode, this.state.gameScore)
            }
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
        console.log(this.defState)
        this.setState({ gameOver: false }, () => {
            setTimeout(() => {
                this.setState({ ...this.defState }, () => {
                    this.generateQuestion();
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
        const { hasGameStarted, questionData, answerDuration, currentGameTime } = this.state;
        let gameTime = displayGameMinsFromSeconds(currentGameTime)
        let prevBestScore = this.props.bestScores && this.props.bestScores[params.currentGameMode] || 0;
        if (!hasGameStarted) {
            return (
                <View style={{ flex: 1, backgroundColor: themeColor.primaryColor, justifyContent: 'center', alignItems: 'center' }}>
                    <StatusBar backgroundColor={themeColor.primaryColor} animated />
                    <Text style={styles.gameStartCount}>{this.state.gameStartCount}</Text>
                </View>
            )
        }

        return (
            <View style={{ flex: 1, backgroundColor: themeColor.primaryColor, paddingBottom: 30 }}>
                <StatusBar backgroundColor={themeColor.primaryColor} animated />
                <View style={styles.header}>
                    <View style={styles.headerLabelContainer}>
                        {
                            params.currentGameMode == 'infinity' ?
                                <Text style={styles.headerLabel}>{gameTime}</Text>
                                :
                                <>
                                    <Icon
                                        name="clock"
                                        type="SimpleLineIcons"
                                        size={30}
                                        color="white"
                                    />
                                    <Text style={styles.headerLabel}>{this.state.currentProgress}</Text>
                                </>
                        }
                    </View>

                    <View style={styles.headerLabelContainer}>
                        <Icon
                            name="trophy"
                            type="SimpleLineIcons"
                            size={30}
                            color="white"
                        />
                        <Text style={styles.headerLabel}>{this.state.gameScore}</Text>
                    </View>
                </View>
                <ProgressBar
                    width={DEVICE_WIDTH - 20}
                    value={this.state.progress}
                    backgroundColor={themeColor.secondaryColor}
                    barAnimationDuration={answerDuration * 1000}
                    backgroundAnimationDuration={20000}
                    borderColor={themeColor.secondaryColor}
                />

                <View style={styles.optionContainer}>
                    {
                        questionData.sign == '%' ?
                            <View style={[styles.questionBlock, { backgroundColor: themeColor.secondaryColor }]}>
                                <Text style={styles.gameDigit}>{questionData.firstDigit}</Text>
                                <Icon
                                    name="arrowright"
                                    type="AntDesign"
                                    size={35}
                                    color="white"
                                    style={{ opacity: 0.8 }}
                                    style={[styles.gameDigit, { marginHorizontal: 10 }]}
                                />
                                <Text style={styles.gameDigit}>{questionData.lastDigit}%</Text>
                            </View>
                            :
                            <View style={[styles.questionBlock, { backgroundColor: themeColor.secondaryColor }]}>
                                <Text style={styles.gameDigit}>{questionData.firstDigit}</Text>
                                <Text style={[styles.gameDigit, { marginHorizontal: 10 }]}>{questionData.sign}</Text>
                                <Text style={styles.gameDigit}>{questionData.lastDigit}</Text>
                            </View>
                    }

                    <View style={styles.optionsBlock}>
                        {
                            questionData && questionData.options && questionData.options.map((option, index) => {
                                return (
                                    <TouchableOpacity onPress={() => this.checkAnswer(option)} style={[styles.gameOption, { backgroundColor: themeColor.secondaryColor, marginRight: index % 2 == 0 ? 15 : 0 }]}>
                                        <Text style={styles.optionDigit}>{option}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
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
                </View>

                <GameOverPopup
                    visible={this.state.gameOver}
                    gameScore={this.state.gameScore}
                    bestScore={prevBestScore}
                    navigateToHome={() => this.navigateToHome()}
                    restartGame={() => this.restartGame()}
                    popupTitle={params.currentGameMode == 'infinity' ? 'Time over' : 'Game Over'}
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

export default connect(mapStateToProps, mapDispatchToProps)(Game);