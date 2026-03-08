import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [topCategories, setTopCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // 获取设备 ID（简化版，实际应该持久化）
  const getDeviceId = () => {
    return 'device-001';
  };

  // 加载今日统计数据
  const loadStats = async () => {
    try {
      const deviceId = getDeviceId();
      const today = new Date().toISOString().split('T')[0];
      const startDate = `${today}T00:00:00Z`;
      const endDate = `${today}T23:59:59Z`;

      // 获取会话统计
      const sessionResponse = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/sessions/stats?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`
      );
      const sessionData = await sessionResponse.json();
      setSessionStats(sessionData);

      // 获取报告数据（包含分类统计）
      const reportResponse = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/reports/summary?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`
      );
      const reportData = await reportResponse.json();
      setTopCategories(reportData.topCategories || []);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建使用会话
  const createSession = async () => {
    try {
      const deviceId = getDeviceId();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/sessions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId }),
        }
      );
      const data = await response.json();
      setSessionId(data.id);
      setSessionStartTime(Date.now());
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  // 结束使用会话
  const endSession = async () => {
    if (!sessionId) return;

    try {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/sessions/${sessionId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ durationSeconds: duration }),
        }
      );
      setSessionId(null);
      setSessionStartTime(0);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  // 页面聚焦时刷新数据
  useFocusEffect(
    React.useCallback(() => {
      loadStats();
      return () => {};
    }, [])
  );

  // 应用状态变化处理（前台/后台）
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        createSession();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        endSession();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // 如果当前应用是活跃状态，创建会话
    if (AppState.currentState === 'active') {
      createSession();
    }

    return () => {
      subscription.remove();
      endSession();
    };
  }, []);

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

  // 获取今日日期
  const getTodayDate = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${month}月${day}日 ${weekDays[date.getDay()]}`;
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
            你看看你
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.subtitle}>
            {getTodayDate()}
          </ThemedText>
        </View>

        {/* 今日概览卡片 */}
        <View style={styles.statsCard}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.cardTitle}>
            今日概览
          </ThemedText>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <FontAwesome6 name="clock" size={24} color={theme.primary} />
              </View>
              <ThemedText variant="body" color={theme.textMuted} style={styles.statLabel}>
                使用时长
              </ThemedText>
              <ThemedText variant="h2" color={theme.primary} style={styles.statValue}>
                {formatDuration(sessionStats?.totalDuration || 0)}
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <FontAwesome6 name="rotate" size={24} color={theme.accent} />
              </View>
              <ThemedText variant="body" color={theme.textMuted} style={styles.statLabel}>
                打开次数
              </ThemedText>
              <ThemedText variant="h2" color={theme.accent} style={styles.statValue}>
                {sessionStats?.totalSessions || 0}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* 内容偏好 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h4" color={theme.textPrimary}>
              内容偏好
            </ThemedText>
          </View>

          {topCategories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome6 name="chart-pie" size={48} color={theme.border} />
              <ThemedText variant="body" color={theme.textMuted} style={styles.emptyText}>
                暂无数据，开始记录你的内容吧
              </ThemedText>
            </View>
          ) : (
            topCategories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryRank}>
                    <ThemedText variant="body" color="#FFFFFF" style={styles.rankNumber}>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <ThemedText variant="title" color={theme.textPrimary} style={styles.categoryName}>
                    {category.name}
                  </ThemedText>
                </View>
                <View style={styles.categoryStats}>
                  <ThemedText variant="body" color={theme.textMuted}>
                    {category.count}次
                  </ThemedText>
                  <ThemedText variant="body" color={theme.primary} style={styles.categoryPercentage}>
                    {category.percentage.toFixed(1)}%
                  </ThemedText>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
