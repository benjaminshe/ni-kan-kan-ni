import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing['5xl'],
    },
    header: {
      marginBottom: Spacing.xl,
    },
    subtitle: {
      marginTop: Spacing.xs,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing['6xl'],
    },
    emptyText: {
      marginTop: Spacing.lg,
      textAlign: 'center',
    },
    recordItem: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      shadowColor: theme.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    recordHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    recordInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    recordText: {
      flex: 1,
    },
    recordTitle: {
      marginBottom: 2,
    },
    recordDate: {
      marginLeft: Spacing.md,
    },
    recordNotes: {
      marginTop: Spacing.sm,
      marginLeft: 52,
    },
    categoryBadge: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    deleteButton: {
      padding: Spacing.xs,
    },
    recordDescription: {
      marginLeft: 52,
      marginBottom: Spacing.sm,
    },
    durationBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: theme.backgroundTertiary,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      marginLeft: 52,
      gap: Spacing.xs,
    },
    durationText: {
      fontWeight: '600',
    },
    fab: {
      position: 'absolute',
      bottom: Spacing['6xl'],
      right: Spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.backgroundDefault,
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalBody: {
      padding: Spacing.xl,
    },
    label: {
      marginBottom: Spacing.sm,
      fontWeight: '600',
    },
    categoryScrollContainer: {
      marginBottom: Spacing.lg,
    },
    categoryScroll: {
      flex: 1,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.backgroundTertiary,
      marginRight: Spacing.sm,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    categoryChipActive: {
      borderWidth: 0,
    },
    categoryChipText: {
      marginLeft: Spacing.xs,
    },
    input: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.lg,
      fontSize: 16,
      color: theme.textPrimary,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    modalFooter: {
      flexDirection: 'row',
      padding: Spacing.xl,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: Spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.backgroundTertiary,
    },
    saveButton: {
      backgroundColor: theme.primary,
    },
    addButton: {
      position: 'absolute',
      bottom: Spacing['6xl'],
      right: Spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    formGroup: {
      marginBottom: Spacing.lg,
    },
    formLabel: {
      marginBottom: Spacing.sm,
      fontWeight: '600',
    },
    categoryOption: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.backgroundTertiary,
      marginRight: Spacing.sm,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    textarea: {
      height: 80,
      textAlignVertical: 'top',
    },
    submitButton: {
      flex: 1,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      backgroundColor: theme.primary,
    },
  });
};
