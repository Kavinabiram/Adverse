const db = require('../config/db');

// @desc Get dashboard stats
const getDashboardStats = async (req, res) => {
    const driversCount = await db.query('SELECT COUNT(*) FROM drivers');
    const companiesCount = await db.query('SELECT COUNT(*) FROM advertising_companies');
    const adsCount = await db.query('SELECT COUNT(*) FROM advertisements');
    const revenueSum = await db.query('SELECT SUM(amount) FROM revenue');

    res.json({
        totalDrivers: parseInt(driversCount.rows[0].count),
        totalCompanies: parseInt(companiesCount.rows[0].count),
        totalAds: parseInt(adsCount.rows[0].count),
        totalRevenue: parseFloat(revenueSum.rows[0].sum || 0),
    });
};

// @desc Get revenue reports
const getRevenueReport = async (req, res) => {
    const result = await db.query(
        'SELECT date_trunc(\'month\', created_at) AS month, SUM(amount) AS total_revenue FROM revenue GROUP BY month ORDER BY month DESC'
    );
    res.json(result.rows);
};

// @desc Get ads performance report
const getAdsPerformance = async (req, res) => {
    const result = await db.query(
        'SELECT a.ad_title, COUNT(r.id) AS performance_count FROM advertisements a LEFT JOIN revenue r ON a.id = r.ad_id GROUP BY a.ad_title'
    );
    res.json(result.rows);
};

module.exports = { getDashboardStats, getRevenueReport, getAdsPerformance };
