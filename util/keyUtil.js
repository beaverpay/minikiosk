exports.keyCompare = function (keyArray, inputKeyArray) {
    if (inputKeyArray.join('+') !== keyArray.join('+')) {
        throw new Error('key 오류');
    } else {
        return true;
    }
};
