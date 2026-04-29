process.env.DB_NAME = "school_management";
const db = require("./config/db");

async function migrate() {
  try {
    console.log("Starting migration...");

    try {
      const [existing] = await db.query(
        `SELECT id FROM academic_years LIMIT 1`,
      );
      let ayId = 1;
      if (existing.length === 0) {
        const [result] = await db.query(`
            INSERT INTO academic_years (school_id, name, start_date, end_date) 
            VALUES ((SELECT MIN(id) FROM schools), 'Default Academic Year', '2020-01-01', '2020-12-31')
          `);
        console.log(
          "Inserted default academic year to satisfy existing batches.",
        );
        ayId = result.insertId;
      } else {
        ayId = existing[0].id;
      }

      await db.query(
        `UPDATE batches SET academic_year_id = ? WHERE academic_year_id NOT IN (SELECT id FROM academic_years)`,
        [ayId],
      );

      await db.query(`
        ALTER TABLE batches 
        ADD CONSTRAINT fk_batch_academic_year 
        FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
      `);
      console.log("Added foreign key constraint to batches.");
    } catch (err) {
      console.log(
        "Foreign key might already exist, or couldn't be added:",
        err.message,
      );
    }

    console.log("Finished foreign key migration!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migrate();
