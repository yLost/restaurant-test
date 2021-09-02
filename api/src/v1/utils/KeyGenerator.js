const chars = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

/**
 * @param {Number} amount Size of key
 * @returns {String} A random key 
 */
function generate(amount = 10) {
    let key = "";
    for (let i = 0; i < amount; i++) {
        const randomNumber = Math.floor((Math.random() * (chars.length - 1)) + 1);
        const uppercase = Math.floor((Math.random() * 10) + 1) > 5;

        let char = chars[randomNumber];
        key += (uppercase ? char.toUpperCase() : char);
    }
    return key;
}

module.exports = generate;