exports.keyCompare = function (keyArray, inputKeyArray) {
    if (inputKeyArray.join('+') !== keyArray.join('+')) {
        return false;
    } else {
        return true;
    }
};
