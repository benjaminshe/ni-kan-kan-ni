import express from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = express.Router();

/**
 * 获取内容记录列表
 * GET /api/v1/content-records
 * Query: { deviceId: string, categoryId?: number, startDate?: string, endDate?: string, limit?: number }
 */
router.get('/', async (req, res) => {
  try {
    const { deviceId, categoryId, startDate, endDate, limit = 50 } = req.query;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required' });
    }

    const client = getSupabaseClient();
    let query = client
      .from('content_records')
      .select('*')
      .eq('device_id', deviceId)
      .order('recorded_at', { ascending: false })
      .limit(Number(limit));

    if (categoryId) {
      query = query.eq('category_id', Number(categoryId));
    }

    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }

    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching content records:', error);
      return res.status(500).json({ error: 'Failed to fetch content records' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error in GET /content-records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 创建内容记录
 * POST /api/v1/content-records
 * Body: { deviceId: string, categoryId: number, contentTitle: string, contentDescription?: string, durationSeconds?: number, recordedAt?: string }
 */
router.post('/', async (req, res) => {
  try {
    const {
      deviceId,
      categoryId,
      contentTitle,
      contentDescription,
      durationSeconds = 0,
      recordedAt,
    } = req.body;

    if (!deviceId || !categoryId || !contentTitle) {
      return res.status(400).json({
        error: 'deviceId, categoryId, and contentTitle are required',
      });
    }

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('content_records')
      .insert({
        device_id: deviceId,
        category_id: Number(categoryId),
        content_title: contentTitle,
        content_description: contentDescription,
        duration_seconds: Number(durationSeconds) || 0,
        recorded_at: recordedAt || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating content record:', error);
      return res.status(500).json({ error: 'Failed to create content record' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in POST /content-records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 删除内容记录
 * DELETE /api/v1/content-records/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const client = getSupabaseClient();

    const { error } = await client.from('content_records').delete().eq('id', Number(id));

    if (error) {
      console.error('Error deleting content record:', error);
      return res.status(500).json({ error: 'Failed to delete content record' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /content-records/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
