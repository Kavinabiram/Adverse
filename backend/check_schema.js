const db = require('./config/db.js');
async function check() {
  try {
    const res = await db.query("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'users'");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
check();
