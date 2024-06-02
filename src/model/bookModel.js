const mysql = require('../config/configMysql');

const checkBookByISBN = async (isbn) => {
  try {
    const query = 'SELECT 1 FROM books WHERE isbn = ? LIMIT 1';
    const [results] = await mysql.query(query, [isbn]);

    return results.length > 0;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

const getBooksByISBN = async (isbns) => {
  try {
    if (isbns.length) {
      const placeholders = isbns.map(() => '?').join(',');
      const query = `SELECT * FROM books WHERE isbn IN (${placeholders})`;
      
      const [results] = await mysql.query(query, isbns);
  
      return results;
    }

    return [];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

module.exports = { checkBookByISBN, getBooksByISBN };