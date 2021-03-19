const getUserByEmail = (email, database) => {
    for (const user in database) {
        console.log(`is this${email} the same as this ${database[user]["email"]} from the database`);
      if (database[user]["email"] === email ) {
        return user;
      };
    };
    return null;
  };

  module.exports = (getUserByEmail);