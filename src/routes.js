import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './screens/Home/HomeScreen'
import SettingScreen from './screens/Settings/SettingScreen'
import GameScreen from './screens/Game/Game'
import EquationScreen from './screens/Equation/Equation'
import TapScreen from './screens/Tap/Tap';
import NumberOrderScreen from './screens/NumberOrder/NumberOrder';

const AppNavigator = createStackNavigator({
    Home: {
        screen: HomeScreen,
    },
    Settings: {
        screen: SettingScreen
    },
    Game: {
        screen: GameScreen
    },
    Equation: {
        screen: EquationScreen
    },
    Tap: {
        screen: TapScreen
    },
    NumberOrder: {
        screen: NumberOrderScreen
    }
}, {
    headerMode: 'none'
});

export default createAppContainer(AppNavigator);