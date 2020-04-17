import { StyleSheet, Dimensions } from 'react-native'
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
export default styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        textAlign: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        paddingTop: 20,
        flex: 1
    },
    headerLabel: {
        opacity: 0.8,
        marginLeft: 10,
        color: 'white',
        fontFamily: 'toon-bold',
        letterSpacing: 1,
        fontSize: 25
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#fbfbfb',
        borderBottomWidth: 1,
        borderBottomColor: '#dfdfdf',
    },
    cell: {
        minHeight: 25,
        backgroundColor: 'transparent',
        borderRightWidth: 1,
        borderRightColor: '#dfdfdf',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    gameStartCount: {
        color: 'white', marginLeft: 15, fontFamily: 'toon-extra-bold', letterSpacing: 1, fontSize: 200
    },
    gameDigit: {
        color: 'white', fontFamily: 'toon-extra-bold', letterSpacing: 1, fontSize: 40
    },
    instruction: {
        fontSize: 20, textAlign: 'center', color: 'white', fontFamily: 'toon-bold', letterSpacing: 1,
    },
    optionDigit: {
        color: 'white', fontFamily: 'toon-extra-bold', letterSpacing: 1, fontSize: 25
    },
    gameOption: {
        width: (DEVICE_WIDTH - 40) / 2, height: 100, justifyContent: 'center', alignItems: 'center', elevation: 8, borderRadius: 10, flexDirection: 'row', marginBottom: 15, padding: 5
    },
    optionContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 30 },
    questionBlock: { width: DEVICE_WIDTH - 20, height: 100, justifyContent: 'center', alignItems: 'center', elevation: 8, borderRadius: 10, flexDirection: 'row' },
    optionsBlock: { marginTop: 30, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    gameOverButton: {
        color: '#eee', fontFamily: 'toon-bold', letterSpacing: 1, fontSize: 30,
        paddingHorizontal: 20, paddingVertical: 10
    },
    scoreLabel: {
        color: '#eee', fontFamily: 'toon-bold', letterSpacing: 1, fontSize: 20, paddingVertical: 10, width: DEVICE_WIDTH - 60 - 100
    },
    popupBtn: {
        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: 20, padding: 15,
    },
    scoreBtn: {
        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: 100, height: 50
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