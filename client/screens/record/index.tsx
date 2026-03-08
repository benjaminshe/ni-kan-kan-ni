import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';
import { categoryStorage, contentRecordStorage, generateId } from '@/services/storage';

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

export default function RecordScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  // 加载分类列表
  const loadCategories = async () => {
    try {
      const data = await categoryStorage.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // 加载内容记录
  const loadRecords = async () => {
    try {
      const data = await contentRecordStorage.getAll();
      // 按时间倒序排列
      setRecords(data.reverse());
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  // 打开新增模态框
  const handleOpenModal = () => {
    setSelectedCategory(null);
    setTitle('');
    setNotes('');
    setModalVisible(true);
  };

  // 保存记录
  const handleSave = async () => {
    if (!selectedCategory || !title) {
      alert('请选择分类并输入标题');
      return;
    }

    try {
      const newRecord: ContentRecord = {
        id: generateId(),
        categoryId: selectedCategory.id,
        title,
        notes: notes || undefined,
        createdAt: new Date().toISOString(),
      };

      await contentRecordStorage.save(newRecord);

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
      await contentRecordStorage.delete(id);
      loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
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

  // 根据分类 ID 获取分类信息
  const getCategoryById = (categoryId: number) => {
    return categories.find(c => c.id === categoryId);
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
          records.map((record) => {
            const category = getCategoryById(record.categoryId);
            return (
              <View key={record.id} style={styles.recordItem}>
                <View style={styles.recordHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: category?.color || theme.primary }]}>
                    <FontAwesome6 name="folder" size={16} color="#fff" />
                  </View>
                  <View style={styles.recordInfo}>
                    <ThemedText variant="body" color={theme.textPrimary} style={styles.recordTitle}>
                      {record.title}
                    </ThemedText>
                    <ThemedText variant="caption" color={theme.textMuted} style={styles.recordDate}>
                      {category?.name} • {formatDate(record.createdAt)}
                    </ThemedText>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(record.id)}>
                    <FontAwesome6 name="trash" size={20} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>
                {record.notes && (
                  <ThemedText variant="caption" color={theme.textSecondary} style={styles.recordNotes}>
                    {record.notes}
                  </ThemedText>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* 添加按钮 */}
      <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
        <FontAwesome6 name="plus" size={32} color="#fff" />
      </TouchableOpacity>

      {/* 添加模态框 */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <ThemedText variant="h4" color={theme.textPrimary}>
                  添加记录
                </ThemedText>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <FontAwesome6 name="xmark" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Body */}
              <ScrollView style={styles.modalBody}>
                {/* 分类选择 */}
                <View style={styles.formGroup}>
                  <ThemedText variant="body" color={theme.textPrimary} style={styles.formLabel}>
                    选择分类
                  </ThemedText>
                  <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                      {categories.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          style={[
                            styles.categoryOption,
                            selectedCategory?.id === category.id && {
                              backgroundColor: category.color,
                              borderColor: category.color,
                            },
                          ]}
                          onPress={() => setSelectedCategory(category)}
                        >
                          <ThemedText
                            variant="body"
                            color={selectedCategory?.id === category.id ? '#fff' : theme.textPrimary}
                          >
                            {category.name}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                {/* 标题输入 */}
                <View style={styles.formGroup}>
                  <ThemedText variant="body" color={theme.textPrimary} style={styles.formLabel}>
                    标题 *
                  </ThemedText>
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary }]}
                    placeholder="输入标题"
                    placeholderTextColor={theme.textMuted}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                {/* 备注输入 */}
                <View style={styles.formGroup}>
                  <ThemedText variant="body" color={theme.textPrimary} style={styles.formLabel}>
                    备注（可选）
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.textarea,
                      { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary },
                    ]}
                    placeholder="输入备注"
                    placeholderTextColor={theme.textMuted}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <ThemedText variant="body" color={theme.textSecondary}>
                    取消
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                  <ThemedText variant="body" color="#fff">
                    保存
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}
