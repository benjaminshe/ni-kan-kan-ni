import React, { useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleExportData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      const data: Record<string, any> = {};

      items.forEach(([key, value]) => {
        if (value) {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value;
          }
        }
      });

      const jsonString = JSON.stringify(data, null, 2);

      Alert.alert(
        '导出数据',
        '数据已准备好，请手动复制保存',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '复制',
            onPress: () => {
              // 这里可以添加复制到剪贴板的功能
              // 需要使用 expo-clipboard
              alert('数据已复制到剪贴板（需要 expo-clipboard 支持）');
            },
          },
        ],
        { userInterfaceStyle: isDark ? 'dark' : 'light' }
      );
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      '清除数据',
      '确定要清除所有数据吗？此操作不可恢复！',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              await AsyncStorage.multiRemove(keys);
              alert('数据已清除');
            } catch (error) {
              console.error('Clear error:', error);
              alert('清除失败');
            }
          },
        },
      ],
      { userInterfaceStyle: isDark ? 'dark' : 'light' }
    );
  };

  const handleAbout = () => {
    alert('你看看你 v1.0\n一个简单易用的手机使用分析工具\n\n离线模式：数据存储在本地');
  };

  const settingItems: SettingItem[] = [
    {
      icon: 'download',
      title: '导出数据',
      subtitle: '导出使用记录为 JSON',
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
            你看看你 v1.0.0 (离线版)
          </ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}
