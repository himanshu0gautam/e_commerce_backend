import mysql from "mysql2/promise"

let pool;

async function connectDb() {
    try {

        pool = mysql.createPool({
            host: process.env.MYSQL_HOST || "localhost",
            user: process.env.MYSQL_USER,
            database: process.env.MYSQL_DATABASE,
            password: process.env.MYSQL_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        await pool.query('SELECT 1');
        console.log("✅ SQL database connected successfully");
        return pool;

    } catch (error) {
        console.error("❌ Error connecting to DB:", error);
        process.exit(1); // stops app if DB connection fails
    }
}

export default connectDb;
export { pool };


