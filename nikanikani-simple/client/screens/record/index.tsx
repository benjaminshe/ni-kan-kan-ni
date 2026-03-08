import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface ContentRecord {
  id: number;
  category_id: number;
  content_title: string;
  content_description: string;
  duration_seconds: number;
  recorded_at: string;
  categories: Category;
}

export default function RecordScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  // 获取设备 ID
  const getDeviceId = () => {
    return 'device-001';
  };

  // 加载分类列表
  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/categories`
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // 加载内容记录
  const loadRecords = async () => {
    try {
      const deviceId = getDeviceId();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/content-records?deviceId=${deviceId}&limit=20`
      );
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  // 打开新增模态框
  const handleOpenModal = () => {
    setSelectedCategory(null);
    setTitle('');
    setDescription('');
    setDuration('');
    setModalVisible(true);
  };

  // 保存记录
  const handleSave = async () => {
    if (!selectedCategory || !title) {
      alert('请选择分类并输入标题');
      return;
    }

    try {
      const deviceId = getDeviceId();
      await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/content-records`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId,
            categoryId: selectedCategory.id,
            contentTitle: title,
            contentDescription: description,
            durationSeconds: duration ? parseInt(duration) * 60 : 0,
          }),
        }
      );

      setModalVisible(false);
      loadRecords();
    } catch (error) {
      console.error('Error saving record:', error);
      alert('保存失败，请重试');
    }
  };

  // 删除记录
  const handleDelete = async (id: number) => {
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/content-records/${id}`,
        {
          method: 'DELETE',
        }
      );
      loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

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
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日 ${hours}:${minutes}`;
  };

  // 获取分类图标
  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      microchip: 'microchip',
      film: 'film',
      book: 'book',
      heart: 'heart',
      dumbbell: 'dumbbell',
      'book-open': 'book-open',
      briefcase: 'briefcase',
      users: 'users',
    };
    return iconMap[iconName] || 'folder';
  };

  // 页面聚焦时加载数据
  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
      loadRecords();
      return () => {};
    }, [])
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2" color={theme.textPrimary}>
            记录内容
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.subtitle}>
            记录你浏览的内容，了解你的兴趣偏好
          </ThemedText>
        </View>

        {/* 记录列表 */}
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="clipboard-list" size={64} color={theme.border} />
            <ThemedText variant="body" color={theme.textMuted} style={styles.emptyText}>
              暂无记录，点击右下角按钮添加
            </ThemedText>
          </View>
        ) : (
          records.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <View style={styles.recordHeader}>
                <View style={styles.recordInfo}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: record.categories.color || theme.primary },
                    ]}
                  >
                    <FontAwesome6
                      name={getCategoryIcon(record.categories.icon)}
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>
                  <View style={styles.recordText}>
                    <ThemedText variant="title" color={theme.textPrimary} style={styles.recordTitle}>
                      {record.content_title}
                    </ThemedText>
                    <ThemedText variant="caption" color={theme.textMuted}>
                      {record.categories.name} · {formatDate(record.recorded_at)}
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDelete(record.id)} style={styles.deleteButton}>
                  <FontAwesome6 name="trash" size={16} color={theme.error} />
                </TouchableOpacity>
              </View>
              {record.content_description && (
                <ThemedText variant="body" color={theme.textSecondary} style={styles.recordDescription}>
                  {record.content_description}
                </ThemedText>
              )}
              {record.duration_seconds > 0 && (
                <View style={styles.durationBadge}>
                  <FontAwesome6 name="clock" size={12} color={theme.primary} />
                  <ThemedText variant="caption" color={theme.primary} style={styles.durationText}>
                    {formatDuration(record.duration_seconds)}
                  </ThemedText>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* 添加按钮 */}
      <TouchableOpacity style={styles.fab} onPress={handleOpenModal}>
        <FontAwesome6 name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* 新增记录模态框 */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText variant="h4" color={theme.textPrimary}>
                添加记录
              </ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome6 name="xmark" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* 分类选择 */}
              <ThemedText variant="body" color={theme.textPrimary} style={styles.label}>
                选择分类
              </ThemedText>
              <View style={styles.categoryScrollContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryChip,
                        selectedCategory?.id === category.id && styles.categoryChipActive,
                        selectedCategory?.id === category.id && {
                          backgroundColor: category.color || theme.primary,
                        },
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <FontAwesome6
                        name={getCategoryIcon(category.icon)}
                        size={16}
                        color={
                          selectedCategory?.id === category.id
                            ? '#FFFFFF'
                            : category.color || theme.primary
                        }
                      />
                      <ThemedText
                        variant="body"
                        color={
                          selectedCategory?.id === category.id
                            ? '#FFFFFF'
                            : category.color || theme.textPrimary
                        }
                        style={styles.categoryChipText}
                      >
                        {category.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* 标题输入 */}
              <ThemedText variant="body" color={theme.textPrimary} style={styles.label}>
                标题 *
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="输入内容标题"
                placeholderTextColor={theme.textMuted}
                value={title}
                onChangeText={setTitle}
              />

              {/* 描述输入 */}
              <ThemedText variant="body" color={theme.textPrimary} style={styles.label}>
                描述
              </ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="输入内容描述（可选）"
                placeholderTextColor={theme.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              {/* 时长输入 */}
              <ThemedText variant="body" color={theme.textPrimary} style={styles.label}>
                时长（分钟）
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="输入时长（可选）"
                placeholderTextColor={theme.textMuted}
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText variant="body" color={theme.textSecondary}>
                  取消
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
                <ThemedText variant="body" color="#FFFFFF">
                  保存
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}
