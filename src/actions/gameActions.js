export function changeSettingValue(key, value) {
    return async function (dispatch, getState) {
        dispatch({
            type: 'changeSetting',
            key,
            value
        });
    };
}

export function updateBestScore(gameMode, score) {
    return async function (dispatch, getState) {
        let bestScores = getState().game.bestScores || {};
        bestScores[gameMode] = score;
        dispatch({
            type: 'changeSetting',
            key: 'bestScores',
            value: bestScores
        });
    };
}