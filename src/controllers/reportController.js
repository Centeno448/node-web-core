const Boom = require('@hapi/boom');
const db = require('../db/database');

const formatter = new Intl.DateTimeFormat('es', { month: 'short' });

/*
listado de promedio de Reseñas de usuarios

Libros mas intercambiados

Categorias mas intercambiadas

Usuario con mayor cantidad de intercambios

Mes con mayor cantidad de intercambios
*/

// Gets a list of the top 5 users with the best average rating score.
const averageUserRating = async (request, h) => {
  try {
    //console.log(request.auth.credentials);

    var query = {
      text: `
        select U.username as user, R.score
        from public."Rating" R
        JOIN public."AppUser" U on U.id = R."toUser"
        `
    };

    const { rows } = await db.query(query);

    var uniqueUsernames = [];
    var users = [];

    rows.forEach((row) => {
      if (!uniqueUsernames.includes(row.user)) {
        uniqueUsernames.push(row.user);

        users.push({
          user: row.user,
          acumulatedScore: +row.score,
          averageScore: 0,
          amountOfRatings: 1
        });
      } else {
        var found = users.find((user) => user.user == row.user);
        found.acumulatedScore += +row.score;
        found.amountOfRatings++;
      }
    });

    users.forEach((user) => {
      user.averageScore = user.acumulatedScore / user.amountOfRatings;
    });

    users.sort((a, b) => b.averageScore - a.averageScore);

    return users.filter((element, index) => {
      return index < 5;
    });
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

// Gets a list of the top 5 most exchanged books
const mostExchangedBooks = async (request, h) => {
  try {
    //console.log(request.auth.credentials);

    var query = {
      text: `
        select TB.name as "toBook", TB.id as "toBookId", FB.name as "fromBook", FB.id as "fromBookId"
        from public."BookExchange" BE
        join public."Book" TB on TB.id = BE."toBook"
        join public."Book" FB on FB.id = BE."fromBook"
        `
    };

    const { rows } = await db.query(query);

    var uniqueBooks = [];
    var books = [];

    rows.forEach((row) => {
      if (!uniqueBooks.includes(row.toBookId)) {
        uniqueBooks.push(row.toBookId);

        books.push({
          id: row.toBookId,
          name: row.toBook,
          amountOfExchanges: 1
        });
      } else {
        var found = books.find((book) => book.id == row.toBookId);
        found.amountOfExchanges++;
      }

      if (!uniqueBooks.includes(row.fromBookId)) {
        uniqueBooks.push(row.fromBookId);

        books.push({
          id: row.fromBookId,
          name: row.fromBook,
          amountOfExchanges: 1
        });
      } else {
        var found = books.find((book) => book.id == row.fromBookId);
        found.amountOfExchanges++;
      }
    });

    books.sort((a, b) => b.amountOfExchanges - a.amountOfExchanges);

    return books.filter((element, index) => {
      return index < 5;
    });
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

// Gets a list of the top 5 combination for most exchanged categories
const mostExchangedCategories = async (request, h) => {
  try {
    //console.log(request.auth.credentials);

    var query = {
      text: `
        select TC.id as "toCategoryId", TC.name as "toCategory", FC.id as "fromCategoryId", FC.name as "fromCategory"
        from public."BookExchange" BE
        join public."Book" TB on TB.id = BE."toBook"
        join public."Book" FB on FB.id = BE."fromBook"
        join public."BookCategory" TC on TC.id = TB.category
        join public."BookCategory" FC on FC.id = TB.category
        `
    };

    const { rows } = await db.query(query);

    var combinations = [];

    rows.forEach((row) => {
      var combination = combinations.find((combination) => {
        return (
          (combination.toCategoryId == row.toCategoryId &&
            combination.fromCategoryId == row.fromCategoryId) ||
          (combination.fromCategoryId == row.toCategoryId &&
            combination.toCategoryId == row.fromCategoryId)
        );
      });

      var exists = !!combination;

      if (!exists) {
        combinations.push({
          toCategoryId: row.toCategoryId,
          toCategory: row.toCategory,
          fromCategoryId: row.fromCategoryId,
          fromCategory: row.fromCategory,
          amountOfExchanges: 1
        });
      } else {
        combination.amountOfExchanges++;
      }
    });

    combinations.sort((a, b) => b.amountOfExchanges - a.amountOfExchanges);

    return combinations.filter((element, index) => {
      return index < 5;
    });
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

// Gets a list of the top 5 users with the most exchanges
const mostExchangesByUsers = async (request, h) => {
  try {
    //console.log(request.auth.credentials);

    var query = {
      text: `
        select TU.id as "toUserId", TU.username as "toUser", FU.id as "fromUserId", FU.username as "fromUser"
        from public."BookExchange" BE
        join public."AppUser" TU on TU.id = BE."toUser"
        join public."AppUser" FU on FU.id = BE."fromUser"
        `
    };

    const { rows } = await db.query(query);

    var uniqueUsers = [];
    var users = [];

    rows.forEach((row) => {
      if (!uniqueUsers.includes(row.toUserId)) {
        uniqueUsers.push(row.toUserId);

        users.push({
          id: row.toUserId,
          username: row.toUser,
          amountOfExchanges: 1
        });
      } else {
        var found = users.find((user) => {
          return user.id == row.toUserId;
        });

        found.amountOfExchanges++;
      }

      if (!uniqueUsers.includes(row.fromUserId)) {
        uniqueUsers.push(row.fromUserId);

        users.push({
          id: row.fromUserId,
          username: row.fromUser,
          amountOfExchanges: 1
        });
      } else {
        var found = users.find((user) => {
          return user.id == row.fromUserId;
        });

        found.amountOfExchanges++;
      }
    });

    users.sort((a, b) => b.amountOfExchanges - a.amountOfExchanges);

    return users.filter((element, index) => {
      return index < 5;
    });
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

// Gets a list of the top 5 months where exchanges ocurred
const mostExchangesByMonth = async (request, h) => {
  try {
    //console.log(request.auth.credentials);

    var query = {
      text: `
        select BE."exchangeDate"
        from public."BookExchange" BE
        `
    };

    const { rows } = await db.query(query);

    var months = [];

    rows.forEach((row) => {
      var month = formatter.format(new Date(row.exchangeDate));

      var found = months.find((item) => {
        return item.month == month;
      });

      var exists = !!found;

      if (!exists) {
        months.push({ month, amountOfExchanges: 1 });
      } else {
        found.amountOfExchanges++;
      }
    });

    months.sort((a, b) => b.amountOfExchanges - a.amountOfExchanges);

    return months.filter((element, index) => {
      return index < 5;
    });
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

module.exports = {
  averageUserRating,
  mostExchangedBooks,
  mostExchangedCategories,
  mostExchangesByUsers,
  mostExchangesByMonth
};
