const validateExt = file => {
    let nameF, ext, validateExt;
    nameF = file.name.split('.');
    ext = nameF[nameF.length - 1];
    validateExt = ['png', 'jpg', 'gif', 'jpeg'];
    if(validateExt.indexOf(ext) < 0) {
        return true
    } else {
        return false
    }
} 

const validateTypes = types => {
    let validateTypes;
    validateTypes = ['products', 'users']
    if(validateTypes.indexOf(types) < 0) {
        return true
    } else {
        return false
    }
}

module.exports = {
    validateExt,
    validateTypes
}