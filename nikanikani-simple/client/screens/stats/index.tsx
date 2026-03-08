import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';

interface SessionStats {
  totalSessions: number;
  totalDuration: number;
  avgDuration: number;
  dailyStats: Record<string, { sessions: number; duration: number }>;
}

interface CategoryStat {
  name: string;
  count: number;
  totalDuration: number;
  percentage: number;
}

interface ReportData {
  sessionStats: {
    totalSessions: number;
    totalDuration: number;
    avgSessionDuration: number;
  };
  categoryStats: CategoryStat[];
  topCategories: CategoryStat[];
  totalRecords: number;
  dailyStats: Record<string, { sessions: number; duration: number; records: number }>;
}

export default function StatsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  // 获取设备 ID
  const getDeviceId = () => {
    return 'device-001';
  };

  // 加载统计数据
  const loadStats = async () => {
    try {
      setLoading(true);
      const deviceId = getDeviceId();

      // 计算日期范围
      const now = new Date();
      const days = period === 'week' ? 7 : 30;
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
      const endDate = now.toISOString();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/reports/summary?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setReportData(data);
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

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
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
              {formatDuration(reportData?.sessionStats.totalDuration || 0)}
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
              {reportData?.sessionStats.totalSessions || 0}
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
              {formatDuration(reportData?.sessionStats.avgSessionDuration || 0)}
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
              {reportData?.totalRecords || 0}
            </ThemedText>
          </View>
        </View>

        {/* 内容分类统计 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            内容分类
          </ThemedText>

          {reportData?.categoryStats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome6 name="folder-open" size={48} color={theme.border} />
              <ThemedText variant="body" color={theme.textMuted} style={styles.emptyText}>
                暂无数据
              </ThemedText>
            </View>
          ) : (
            reportData?.categoryStats.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: theme.primary }]} />
                  <ThemedText variant="body" color={theme.textPrimary}>
                    {category.name}
                  </ThemedText>
                </View>
                <View style={styles.categoryStats}>
                  <ThemedText variant="body" color={theme.textMuted}>
                    {category.count}次
                  </ThemedText>
                  <ThemedText variant="body" color={theme.primary} style={styles.categoryDuration}>
                    {formatDuration(category.totalDuration)}
                  </ThemedText>
                </View>
              </View>
            ))
          )}
        </View>

        {/* 每日统计 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            每日统计
          </ThemedText>

          {Object.keys(reportData?.dailyStats || {}).length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome6 name="calendar-xmark" size={48} color={theme.border} />
              <ThemedText variant="body" color={theme.textMuted} style={styles.emptyText}>
                暂无数据
              </ThemedText>
            </View>
          ) : (
            Object.entries(reportData?.dailyStats || {})
              .reverse()
              .map(([date, stats]) => (
                <View key={date} style={styles.dailyItem}>
                  <ThemedText variant="body" color={theme.textPrimary} style={styles.dailyDate}>
                    {formatDate(date)}
                  </ThemedText>
                  <View style={styles.dailyStats}>
                    <View style={styles.dailyStat}>
                      <FontAwesome6 name="rotate" size={14} color={theme.textMuted} />
                      <ThemedText variant="caption" color={theme.textMuted} style={styles.dailyStatText}>
                        {stats.sessions}次
                      </ThemedText>
                    </View>
                    <View style={styles.dailyStat}>
                      <FontAwesome6 name="clock" size={14} color={theme.primary} />
                      <ThemedText variant="caption" color={theme.primary} style={styles.dailyStatText}>
                        {formatDuration(stats.duration)}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
