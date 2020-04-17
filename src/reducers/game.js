const initialState = {
    themeColor: { primaryColor: "#2D113C", secondaryColor: "#40264D" },
    soundOn: true,
    vibration: true,
    bestScores:{}
};

export default function game(state = initialState, action = {}) {
    switch (action.type) {
        case 'changeSetting': {
            return {
                ...state,
                [action.key]: action.value
            };
        }
        default:
            return state;
    }
}
