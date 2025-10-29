const mysql = require('mysql2/promise');

async function connectDb() {
    
    try {
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            database: process.env.MYSQL_DATABASE,
            password: process.env.MYSQL_PASSWORD,
<<<<<<< HEAD
=======
            connectionLimit: 10, 
>>>>>>> 9626cc7c1824c10d0a7adcfd824fdf86643cb558
        });

        await pool.query('SELECT 1');
        console.log("Connected to DB");
        return pool;
    } catch (error) {
        console.error("Error connecting to DB:", error);
        process.exit(1); // stops app if DB connection fails
    }
}

module.exports = connectDb;
