const db = require('../config/db');

// @desc Get dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const driversCount = await db.query('SELECT COUNT(*) FROM drivers');
        const companiesCount = await db.query('SELECT COUNT(*) FROM ad_companies');
        const adsCount = await db.query('SELECT COUNT(*) FROM ads');
        const revenueSum = await db.query('SELECT SUM(amount) FROM revenue');

        // Recent Activity (Drivers, Ads, Companies)
        const recentActivity = await db.query(`
            (SELECT 'driver' as type, u.name as title, 'registered' as action, drivers.created_at 
             FROM drivers JOIN users u ON drivers.user_id = u.id ORDER BY drivers.created_at DESC LIMIT 2)
            UNION ALL
            (SELECT 'ad' as type, title, 'created' as action, created_at FROM ads ORDER BY created_at DESC LIMIT 2)
            UNION ALL
            (SELECT 'company' as type, name as title, 'onboarded' as action, created_at FROM ad_companies ORDER BY created_at DESC LIMIT 2)
            ORDER BY created_at DESC LIMIT 5
        `);

        // Registration Trend (Drivers + Ads + Companies) - Real data for trends
        const trendsData = await db.query(`
            SELECT 
                to_char(date_trunc('month', created_at), 'Mon') as month,
                COUNT(*) as count
            FROM (
                SELECT created_at FROM drivers
                UNION ALL
                SELECT created_at FROM ads
                UNION ALL
                SELECT created_at FROM ad_companies
            ) as combined
            WHERE created_at > NOW() - INTERVAL '6 months'
            GROUP BY date_trunc('month', created_at)
            ORDER BY date_trunc('month', created_at)
        `);

        // If no play logs, we use the trendsData for the chart to show "Platform Growth" instead of empty playbacks
        const performanceData = await db.query(`
            SELECT 
                to_char(date_trunc('month', played_at), 'Mon') as month,
                COUNT(*) as impressions
            FROM ad_play_logs
            WHERE played_at > NOW() - INTERVAL '6 months'
            GROUP BY date_trunc('month', played_at)
            ORDER BY date_trunc('month', played_at)
        `);

        res.json({
            totalDrivers: parseInt(driversCount.rows[0].count),
            totalCompanies: parseInt(companiesCount.rows[0].count),
            totalAds: parseInt(adsCount.rows[0].count),
            totalRevenue: parseFloat(revenueSum.rows[0].sum || 0),
            recentActivity: recentActivity.rows,
            performance: performanceData.rows.length > 0 ? performanceData.rows : trendsData.rows,
            isPerformanceMock: performanceData.rows.length === 0,
            chartLabel: performanceData.rows.length > 0 ? 'Playback Impressions' : 'Platform Growth (Registrations)'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get all audit logs (Paginated)
const getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const result = await db.query(`
            (SELECT 'driver' as type, u.name as title, 'registered' as action, drivers.created_at 
             FROM drivers JOIN users u ON drivers.user_id = u.id)
            UNION ALL
            (SELECT 'ad' as type, title as title, 'created' as action, created_at FROM ads)
            UNION ALL
            (SELECT 'company' as type, name as title, 'onboarded' as action, created_at FROM ad_companies)
            ORDER BY created_at DESC 
            LIMIT $1 OFFSET $2
        `, [limit, offset]);

        const totalResult = await db.query(`
            SELECT (
                (SELECT COUNT(*) FROM drivers) + 
                (SELECT COUNT(*) FROM ads) + 
                (SELECT COUNT(*) FROM ad_companies)
            ) as total
        `);

        res.json({
            logs: result.rows,
            total: parseInt(totalResult.rows[0].total)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get revenue reports
const getRevenueReport = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT date_trunc(\'month\', created_at) AS month, SUM(amount) AS total_revenue FROM revenue GROUP BY month ORDER BY month DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get ads performance report
const getAdsPerformance = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT a.title, COUNT(l.id) AS performance_count FROM ads a LEFT JOIN ad_play_logs l ON a.id = l.ad_id GROUP BY a.title'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDashboardStats, getAuditLogs, getRevenueReport, getAdsPerformance };
