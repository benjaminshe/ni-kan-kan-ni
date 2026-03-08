import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';
import { sessionStorage, categoryStorage, contentRecordStorage } from '@/services/storage';

interface Session {
  id: number;
  deviceId: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

interface ContentRecord {
  id: number;
  categoryId: number;
  title: string;
  notes?: string;
  createdAt: string;
}

interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export default function StatsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [totalDuration, setTotalDuration] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [avgDuration, setAvgDuration] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  // 加载统计数据
  const loadStats = async () => {
    try {
      setLoading(true);

      // 计算日期范围
      const now = new Date();
      const days = period === 'week' ? 7 : 30;
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      // 加载会话数据
      const sessions = await sessionStorage.getAll();
      const filteredSessions = sessions.filter(
        (session) => new Date(session.startTime) >= startDate
      );

      const totalDur = filteredSessions.reduce((sum, s) => sum + s.durationSeconds, 0);
      const totalCount = filteredSessions.length;
      const avgDur = totalCount > 0 ? Math.floor(totalDur / totalCount) : 0;

      setTotalDuration(totalDur);
      setTotalSessions(totalCount);
      setAvgDuration(avgDur);

      // 加载内容记录
      const records = await contentRecordStorage.getAll();
      const filteredRecords = records.filter(
        (record) => new Date(record.createdAt) >= startDate
      );

      setTotalRecords(filteredRecords.length);

      // 统计分类
      const categories = await categoryStorage.getAll();
      const categoryMap = new Map<number, Category>();

      categories.forEach((cat) => {
        categoryMap.set(cat.id, cat);
      });

      const categoryCountMap = new Map<number, number>();
      filteredRecords.forEach((record) => {
        const count = categoryCountMap.get(record.categoryId) || 0;
        categoryCountMap.set(record.categoryId, count + 1);
      });

      const stats: CategoryStat[] = [];
      categoryCountMap.forEach((count, categoryId) => {
        const category = categoryMap.get(categoryId);
        if (category) {
          stats.push({
            name: category.name,
            count,
            percentage: Math.round((count / filteredRecords.length) * 100),
            color: category.color,
          });
        }
      });

      // 按数量排序
      stats.sort((a, b) => b.count - a.count);
      setCategoryStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // 页面聚焦或周期改变时刷新数据
  useFocusEffect(
    React.useCallback(() => {
      loadStats();
      return () => {};
    }, [period])
  );

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else if (minutes > 0) {
      return `${minutes}分钟`;
    } else {
      return `${seconds}秒`;
    }
  };

  if (loading) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={styles.loadingContainer}>
          <ThemedText variant="body" color={theme.textSecondary}>
            加载中...
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2" color={theme.textPrimary}>
            数据统计
          </ThemedText>
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
              onPress={() => setPeriod('week')}
            >
              <ThemedText
                variant="body"
                color={period === 'week' ? theme.buttonPrimaryText : theme.textSecondary}
              >
                本周
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
              onPress={() => setPeriod('month')}
            >
              <ThemedText
                variant="body"
                color={period === 'month' ? theme.buttonPrimaryText : theme.textSecondary}
              >
                本月
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 使用时长统计 */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <FontAwesome6 name="clock" size={24} color={theme.primary} />
            </View>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.statLabel}>
              总使用时长
            </ThemedText>
            <ThemedText variant="h2" color={theme.primary} style={styles.statValue}>
              {formatDuration(totalDuration)}
            </ThemedText>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <FontAwesome6 name="rotate" size={24} color={theme.accent} />
            </View>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.statLabel}>
              打开次数
            </ThemedText>
            <ThemedText variant="h2" color={theme.accent} style={styles.statValue}>
              {totalSessions}
            </ThemedText>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <FontAwesome6 name="chart-line" size={24} color={theme.success} />
            </View>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.statLabel}>
              平均时长
            </ThemedText>
            <ThemedText variant="h2" color={theme.success} style={styles.statValue}>
              {formatDuration(avgDuration)}
            </ThemedText>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <FontAwesome6 name="list-check" size={24} color={theme.textPrimary} />
            </View>
            <ThemedText variant="caption" color={theme.textMuted} style={styles.statLabel}>
              内容记录
            </ThemedText>
            <ThemedText variant="h2" color={theme.textPrimary} style={styles.statValue}>
              {totalRecords}
            </ThemedText>
          </View>
        </View>

        {/* 内容分类统计 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            内容分类统计
          </ThemedText>

          {categoryStats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText variant="body" color={theme.textMuted}>
                暂无数据
              </ThemedText>
            </View>
          ) : (
            categoryStats.map((stat, index) => (
              <View key={index} style={styles.categoryStatItem}>
                <View style={styles.categoryStatHeader}>
                  <View style={[styles.categoryIndicator, { backgroundColor: stat.color }]} />
                  <ThemedText variant="body" color={theme.textPrimary} style={styles.categoryName}>
                    {stat.name}
                  </ThemedText>
                  <ThemedText variant="body" color={theme.textPrimary} style={styles.categoryCount}>
                    {stat.count}条
                  </ThemedText>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${stat.percentage}%`,
                        backgroundColor: stat.color,
                      },
                    ]}
                  />
                </View>
                <ThemedText variant="caption" color={theme.textMuted} style={styles.categoryPercentage}>
                  {stat.percentage}%
                </ThemedText>
              </View>
            ))
          )}
        </View>

        {/* 离线提示 */}
        <View style={styles.tipCard}>
          <FontAwesome6 name="circle-info" size={20} color={theme.primary} />
          <ThemedText variant="body" color={theme.textSecondary} style={styles.tipText}>
            离线模式：数据存储在本地，无需联网
          </ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}
