import express from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = express.Router();

/**
 * 获取分类列表
 * GET /api/v1/categories
 */
router.get('/', async (req, res) => {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error in GET /categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 创建分类
 * POST /api/v1/categories
 * Body: { name: string, icon?: string, color?: string }
 */
router.post('/', async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('categories')
      .insert({
        name,
        icon,
        color,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return res.status(500).json({ error: 'Failed to create category' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in POST /categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
