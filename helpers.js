const getUserByEmail = (email, database) => {
    for (const user in database) {
        //console.log(`is this${email} the same as this ${database[user]["email"]} from the database`);
      if (database[user]["email"] === email ) {
        return user;
      };
    };
    return null;
  };

//random string
function generateRandomString() {
    const possibleLetters = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
    let randomString = "";
    for (let i = 0; i < 6; i++) {
      randomString += possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
    };
    return randomString;
  };

  module.exports = (getUserByEmail);
  module.exports = (generateRandomString);