import express from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = express.Router();

/**
 * 获取汇总报告
 * GET /api/v1/reports/summary
 * Query: { deviceId: string, startDate?: string, endDate?: string }
 */
router.get('/summary', async (req, res) => {
  try {
    const { deviceId, startDate, endDate } = req.query;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required' });
    }

    const client = getSupabaseClient();

    // 获取会话数据
    let sessionsQuery = client
      .from('sessions')
      .select('*')
      .eq('device_id', deviceId);

    if (startDate) {
      sessionsQuery = sessionsQuery.gte('started_at', startDate);
    }

    if (endDate) {
      sessionsQuery = sessionsQuery.lte('started_at', endDate);
    }

    const { data: sessions, error: sessionsError } = await sessionsQuery;

    if (sessionsError) {
      console.error('Error fetching sessions for report:', sessionsError);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }

    // 获取内容记录数据
    let contentQuery = client
      .from('content_records')
      .select('*, categories(*)')
      .eq('device_id', deviceId);

    if (startDate) {
      contentQuery = contentQuery.gte('recorded_at', startDate);
    }

    if (endDate) {
      contentQuery = contentQuery.lte('recorded_at', endDate);
    }

    const { data: contentRecords, error: contentError } = await contentQuery;

    if (contentError) {
      console.error('Error fetching content records for report:', contentError);
      return res.status(500).json({ error: 'Failed to fetch content records' });
    }

    // 计算会话统计
    const sessionData = sessions || [];
    const totalSessions = sessionData.length;
    const totalDuration = sessionData.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const avgSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    // 计算内容分类统计
    const contentData = contentRecords || [];
    const categoryStats: Record<number, { name: string; count: number; totalDuration: number; percentage: number }> = {};
    const totalRecords = contentData.length;

    contentData.forEach((record) => {
      const categoryId = record.category_id;
      const categoryName = record.categories?.name || 'Unknown';

      if (!categoryStats[categoryId]) {
        categoryStats[categoryId] = {
          name: categoryName,
          count: 0,
          totalDuration: 0,
          percentage: 0,
        };
      }

      categoryStats[categoryId].count += 1;
      categoryStats[categoryId].totalDuration += record.duration_seconds || 0;
    });

    // 计算百分比
    Object.keys(categoryStats).forEach((categoryId) => {
      categoryStats[Number(categoryId)].percentage =
        totalRecords > 0 ? (categoryStats[Number(categoryId)].count / totalRecords) * 100 : 0;
    });

    // 按日期分组统计
    const dailyStats: Record<string, { sessions: number; duration: number; records: number }> = {};
    sessionData.forEach((session) => {
      const date = session.started_at.split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { sessions: 0, duration: 0, records: 0 };
      }
      dailyStats[date].sessions += 1;
      dailyStats[date].duration += session.duration_seconds || 0;
    });

    contentData.forEach((record) => {
      const date = record.recorded_at.split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { sessions: 0, duration: 0, records: 0 };
      }
      dailyStats[date].records += 1;
    });

    // 找出最常浏览的分类
    const topCategories = Object.values(categoryStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      sessionStats: {
        totalSessions,
        totalDuration,
        avgSessionDuration,
      },
      categoryStats: Object.values(categoryStats),
      topCategories,
      totalRecords,
      dailyStats,
    });
  } catch (error) {
    console.error('Error in GET /reports/summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
