import React, { useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';

interface SettingItem {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
}

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 获取设备 ID
  const getDeviceId = () => {
    return 'device-001';
  };

  const handleExportData = () => {
    alert('数据导出功能开发中...');
  };

  const handleClearData = () => {
    alert('数据清除功能开发中...');
  };

  const handleAbout = () => {
    alert('你看看你 v1.0\n一个简单易用的手机使用分析工具');
  };

  const settingItems: SettingItem[] = [
    {
      icon: 'download',
      title: '导出数据',
      subtitle: '导出使用记录为 JSON 文件',
      onPress: handleExportData,
      showArrow: true,
    },
    {
      icon: 'trash-can',
      title: '清除数据',
      subtitle: '清除所有使用记录',
      onPress: handleClearData,
      showArrow: true,
    },
    {
      icon: 'circle-info',
      title: '关于',
      subtitle: '版本信息',
      onPress: handleAbout,
      showArrow: true,
    },
  ];

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <FontAwesome6 name="user" size={40} color={theme.primary} />
          </View>
          <ThemedText variant="h3" color={theme.textPrimary} style={styles.userName}>
            设备用户
          </ThemedText>
          <ThemedText variant="body" color={theme.textMuted} style={styles.deviceId}>
            设备 ID: {getDeviceId()}
          </ThemedText>
        </View>

        {/* 统计卡片 */}
        <View style={styles.statsCard}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.cardTitle}>
            使用统计
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.cardSubtitle}>
            开始记录你的使用习惯
          </ThemedText>
        </View>

        {/* 设置列表 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            设置
          </ThemedText>

          {settingItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.settingIcon}>
                <FontAwesome6 name={item.icon as any} size={20} color={theme.primary} />
              </View>
              <View style={styles.settingInfo}>
                <ThemedText variant="body" color={theme.textPrimary}>
                  {item.title}
                </ThemedText>
                {item.subtitle && (
                  <ThemedText variant="caption" color={theme.textMuted} style={styles.settingSubtitle}>
                    {item.subtitle}
                  </ThemedText>
                )}
              </View>
              {item.showArrow && (
                <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 版本信息 */}
        <View style={styles.footer}>
          <ThemedText variant="caption" color={theme.textMuted}>
            你看看你 v1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}
