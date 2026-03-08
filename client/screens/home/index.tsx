import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createStyles } from './styles';
import { sessionStorage, getTodayDateString, generateId } from '@/services/storage';

interface SessionStats {
  totalSessions: number;
  totalDuration: number;
  avgDuration: number;
  dailyStats: Record<string, { sessions: number; duration: number }>;
}

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalSessions: 0,
    totalDuration: 0,
    avgDuration: 0,
    dailyStats: {},
  });
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  // 加载今日统计数据
  const loadStats = async () => {
    try {
      const sessions = await sessionStorage.getAll();
      const today = getTodayDateString();

      // 筛选今天的会话
      const todaySessions = sessions.filter(session => {
        const startTime = new Date(session.startTime);
        return startTime.toISOString().split('T')[0] === today;
      });

      const totalSessions = todaySessions.length;
      const totalDuration = todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0);
      const avgDuration = totalSessions > 0 ? Math.floor(totalDuration / totalSessions) : 0;

      setSessionStats({
        totalSessions,
        totalDuration,
        avgDuration,
        dailyStats: {},
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建使用会话
  const createSession = async () => {
    try {
      const id = generateId();
      const startTime = new Date().toISOString();

      // 保存到当前会话
      await sessionStorage.setCurrentSession({ id, startTime });

      // 创建会话记录
      await sessionStorage.save({
        id,
        deviceId: 'device-001',
        startTime,
        durationSeconds: 0,
      });

      setCurrentSessionId(id);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  // 结束使用会话
  const endSession = async () => {
    if (!currentSessionId) return;

    try {
      const currentSession = await sessionStorage.getCurrentSession();
      if (!currentSession) return;

      const endTime = new Date().toISOString();
      const durationSeconds = Math.floor(
        (new Date().getTime() - new Date(currentSession.startTime).getTime()) / 1000
      );

      // 更新会话
      await sessionStorage.update(currentSessionId, {
        endTime,
        durationSeconds,
      });

      // 清除当前会话
      await sessionStorage.clearCurrentSession();
      setCurrentSessionId(null);

      // 刷新统计数据
      await loadStats();
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
              <ThemedText variant="h3" color={theme.textPrimary} style={styles.statValue}>
                {formatDuration(sessionStats.totalDuration)}
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <FontAwesome6 name="rotate" size={24} color={theme.primary} />
              </View>
              <ThemedText variant="body" color={theme.textMuted} style={styles.statLabel}>
                使用次数
              </ThemedText>
              <ThemedText variant="h3" color={theme.textPrimary} style={styles.statValue}>
                {sessionStats.totalSessions}次
              </ThemedText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <FontAwesome6 name="hourglass-half" size={24} color={theme.primary} />
              </View>
              <ThemedText variant="body" color={theme.textMuted} style={styles.statLabel}>
                平均时长
              </ThemedText>
              <ThemedText variant="h3" color={theme.textPrimary} style={styles.statValue}>
                {formatDuration(sessionStats.avgDuration)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* 使用提示 */}
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
