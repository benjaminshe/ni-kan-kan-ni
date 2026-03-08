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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      marginBottom: Spacing.xl,
    },
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.full,
      padding: Spacing.xs,
      marginTop: Spacing.sm,
    },
    periodButton: {
      flex: 1,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.full,
      alignItems: 'center',
    },
    periodButtonActive: {
      backgroundColor: theme.primary,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: Spacing.xl,
      gap: Spacing.md,
    },
    statCard: {
      width: '48%',
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      shadowColor: theme.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    statIconContainer: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    statLabel: {
      marginBottom: Spacing.xs,
    },
    statValue: {
      textAlign: 'center',
    },
    section: {
      marginTop: Spacing.xl,
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: Spacing['4xl'],
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
    },
    emptyText: {
      marginTop: Spacing.lg,
      textAlign: 'center',
    },
    categoryItem: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: theme.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: Spacing.md,
    },
    categoryStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    categoryDuration: {
      fontWeight: '600',
    },
    dailyItem: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: theme.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    dailyDate: {
      fontWeight: '600',
    },
    dailyStats: {
      flexDirection: 'row',
      gap: Spacing.lg,
    },
    dailyStat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    dailyStatText: {
      fontWeight: '600',
    },
    categoryStatItem: {
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
    categoryStatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    categoryIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: Spacing.md,
    },
    categoryName: {
      flex: 1,
    },
    categoryCount: {
      fontWeight: '600',
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: 4,
      marginBottom: Spacing.xs,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      borderRadius: 4,
    },
    categoryPercentage: {
      textAlign: 'right',
      marginTop: Spacing.xs,
    },
    tipCard: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      shadowColor: theme.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    tipText: {
      flex: 1,
    },
  });
};
