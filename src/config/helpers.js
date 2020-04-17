var randomize = require('randomatic');

let percentages = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

export const randomFromArray = (arr) => arr[Math.floor((Math.random() * arr.length))];

export const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export const generateRandomOptions = (answer, sign, min, max) => { // -1, -
    let array = [], oldOptions = [];
    // if (sign && sign == '/' || sign == '%' || sign == '*') {
    max = Math.max(20, answer);
    min = 2;
    // }
    array = Array(3).fill(1).map((a) => {
        let option = randomBetween(min, max); //difficulty = max

        while (option == answer || oldOptions.indexOf(option) >= 0) {
            option = randomBetween(min, max);
        }
        oldOptions.push(option)
        return answer < 0 ? option * -1 : option
    });

    return array;
}

export const generateRandomOptionsForEquation = (inputs) => { //[firstDigit, lastDigit, answer]
    let array = [], checkOptions = [...inputs], numberLength = ('' + inputs[0]).length
    array = Array(2).fill(1).map((a) => {
        let option = randomize('0', numberLength, { exclude: checkOptions }) //difficulty = max
        checkOptions.push(option);
        return inputs[2] < 0 ? option * -1 : option
    });

    return array;
}

export function generateUniqueNumbers(totalNumbers, min, max) {
    let array = [], checkOptions = [], random = randomBetween(min, max);
    let numberLength = ('' + random).length;

    array = Array(totalNumbers).fill(1).map((a) => {
        let option = randomize('0', numberLength, { exclude: checkOptions }) //difficulty = max
        checkOptions.push(option);
        return (random % 2 == 0) ? option * -1 : option
    });

    return array;
}

export const randomFromMinMax = (min, max, sign, firstDigit) => {
    let number = randomBetween(min, max);
    if (sign == '/') {
        return firstDigit * (randomBetween(2, 20));
    }
    if (sign == '%') {
        return randomFromArray(percentages)
    }
    return number;

}

export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

export const displayGameMinsFromSeconds = (time) => {
    var hrs = ~~(time / 3600);
    var min = ~~((time % 3600) / 60);
    var sec = time % 60;
    var sec_min = "";
    if (hrs > 0) {
        sec_min += "" + hrs + ":" + (min < 10 ? "0" : "");
    }
    sec_min += "" + min + ":" + (sec < 10 ? "0" : "");
    sec_min += "" + sec;
    return sec_min;
}

//my add app ids
export const bannerId = 'XXX';
export const interstialId = 'XXX';
