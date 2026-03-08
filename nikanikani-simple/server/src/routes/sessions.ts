import express from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = express.Router();

/**
 * 创建使用会话
 * POST /api/v1/sessions
 * Body: { deviceId: string }
 */
router.post('/', async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required' });
    }

    const client = getSupabaseClient();
    const now = new Date().toISOString();

    const { data, error } = await client
      .from('sessions')
      .insert({
        device_id: deviceId,
        started_at: now,
        duration_seconds: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return res.status(500).json({ error: 'Failed to create session' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in POST /sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 结束使用会话
 * PUT /api/v1/sessions/:id
 * Body: { durationSeconds: number }
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { durationSeconds } = req.body;

    if (!durationSeconds || durationSeconds < 0) {
      return res.status(400).json({ error: 'durationSeconds is required and must be >= 0' });
    }

    const client = getSupabaseClient();
    const now = new Date().toISOString();

    const { data, error } = await client
      .from('sessions')
      .update({
        ended_at: now,
        duration_seconds: durationSeconds,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating session:', error);
      return res.status(500).json({ error: 'Failed to update session' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in PUT /sessions/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 获取会话列表
 * GET /api/v1/sessions
 * Query: { deviceId: string, startDate?: string, endDate?: string, limit?: number }
 */
router.get('/', async (req, res) => {
  try {
    const { deviceId, startDate, endDate, limit = 50 } = req.query;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required' });
    }

    const client = getSupabaseClient();
    let query = client
      .from('sessions')
      .select('*')
      .eq('device_id', deviceId)
      .order('started_at', { ascending: false })
      .limit(Number(limit));

    if (startDate) {
      query = query.gte('started_at', startDate);
    }

    if (endDate) {
      query = query.lte('started_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error in GET /sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 获取会话统计数据
 * GET /api/v1/sessions/stats
 * Query: { deviceId: string, startDate?: string, endDate?: string }
 */
router.get('/stats', async (req, res) => {
  try {
    const { deviceId, startDate, endDate } = req.query;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required' });
    }

    const client = getSupabaseClient();
    let query = client
      .from('sessions')
      .select('*')
      .eq('device_id', deviceId);

    if (startDate) {
      query = query.gte('started_at', startDate);
    }

    if (endDate) {
      query = query.lte('started_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching session stats:', error);
      return res.status(500).json({ error: 'Failed to fetch session stats' });
    }

    const sessions = data || [];

    // 计算统计数据
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    // 按日期分组统计
    const dailyStats: Record<string, { sessions: number; duration: number }> = {};
    sessions.forEach((session) => {
      const date = session.started_at.split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { sessions: 0, duration: 0 };
      }
      dailyStats[date].sessions += 1;
      dailyStats[date].duration += session.duration_seconds || 0;
    });

    res.json({
      totalSessions,
      totalDuration,
      avgDuration,
      dailyStats,
    });
  } catch (error) {
    console.error('Error in GET /sessions/stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
