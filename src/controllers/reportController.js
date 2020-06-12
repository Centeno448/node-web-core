const Boom = require('@hapi/boom');
const db = require('../db/database');

const formatter = new Intl.DateTimeFormat('es-EC', { month: 'long' });
const monthTranslator = {
  January: 'Enero',
  February: 'Febrero',
  March: 'Marzo',
  April: 'Abril',
  May: 'Mayo',
  June: 'Junio',
  July: 'Julio',
  August: 'Agosto',
  September: 'Septiembre',
  October: 'Octubre',
  November: 'Noviembre',
  December: 'Diciembre'
};
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
    var i = 0;
    users.forEach((user) => {
      user.index = i;
      i++;
    });

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
          value: 1
        });
      } else {
        var found = books.find((book) => book.id == row.toBookId);
        found.value++;
      }

      if (!uniqueBooks.includes(row.fromBookId)) {
        uniqueBooks.push(row.fromBookId);

        books.push({
          id: row.fromBookId,
          name: row.fromBook,
          value: 1
        });
      } else {
        var found = books.find((book) => book.id == row.fromBookId);
        found.value++;
      }
    });

    books.sort((a, b) => b.value - a.value);

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
        join public."BookCategory" FC on FC.id = FB.category
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
          value: 1
        });
      } else {
        combination.value++;
      }
    });

    combinations.forEach((combination) => {
      combination.name = `${combination.toCategory}-${combination.fromCategory}`;
    });

    combinations.sort((a, b) => b.value - a.value);

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
          name: row.toUser,
          value: 1
        });
      } else {
        var found = users.find((user) => {
          return user.id == row.toUserId;
        });

        found.value++;
      }

      if (!uniqueUsers.includes(row.fromUserId)) {
        uniqueUsers.push(row.fromUserId);

        users.push({
          id: row.fromUserId,
          name: row.fromUser,
          value: 1
        });
      } else {
        var found = users.find((user) => {
          return user.id == row.fromUserId;
        });

        found.value++;
      }
    });

    users.sort((a, b) => b.value - a.value);

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
    var currentYear = new Date().getFullYear();
    var startDate = `${currentYear}-01-01`;
    var endDate = `${currentYear}-12-31`;

    var months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];

    var data = [];

    months.forEach((month) => {
      data.push({
        name: month,
        series: [
          {
            name: `${currentYear}`,
            value: 0
          }
        ]
      });
    });

    var query = {
      text: `
        select BE."exchangeDate"
        from public."BookExchange" BE
        where BE."exchangeDate" BETWEEN $1 AND $2
        `,
      values: [startDate, endDate]
    };

    const { rows } = await db.query(query);

    rows.forEach((row) => {
      var month = formatter.format(new Date(row.exchangeDate));

      var found = data.find((item) => {
        return item.name == monthTranslator[month];
      });

      found.series[0].value++;
    });

    data.sort((a, b) => b.amountOfExchanges - a.amountOfExchanges);

    return data;
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
