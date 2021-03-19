//random string
function generateRandomString() {
    const possibleLetters = "1234567890~!@#$%^&*?-=+QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
    let randomString = "";
    for (let i = 0; i < 6; i++) {
      randomString += possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
    };
    return randomString;
  };

  module.exports = (generateRandomString);