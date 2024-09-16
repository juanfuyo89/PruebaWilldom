const express = require('express');
const { Pool } = require('pg');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;

const pool = new Pool({
  host: 'test-instance-1-cluster.cluster-cys30lik4v4w.us-east-1.rds.amazonaws.com',
  user: 'test-assignment:',
  password: ' gfdjh24m,sddsf ',
  database: '',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        listing_month,
        broker,
        COUNT(listing_id) AS new_listings,
        AVG(revenue) AS average_revenue
      FROM listings
      WHERE listing_date BETWEEN '2020-11-01' AND '2021-11-30'
      GROUP BY listing_month, broker
      ORDER BY listing_month, broker
    `);

    const data = result.rows;
    
    res.render('index', { data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
