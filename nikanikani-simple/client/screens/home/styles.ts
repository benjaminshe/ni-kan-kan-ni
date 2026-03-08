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
    subtitle: {
      marginTop: Spacing.xs,
    },
    statsCard: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.xl,
      shadowColor: theme.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    cardTitle: {
      marginBottom: Spacing.lg,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statIconContainer: {
      width: 56,
      height: 56,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    statLabel: {
      marginBottom: Spacing.xs,
      textAlign: 'center',
    },
    statValue: {
      textAlign: 'center',
    },
    section: {
      marginTop: Spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: Spacing['4xl'],
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
    categoryRank: {
      width: 32,
      height: 32,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    rankNumber: {
      fontSize: 14,
      fontWeight: '700',
    },
    categoryName: {
      flex: 1,
    },
    categoryStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    categoryPercentage: {
      fontWeight: '700',
    },
  });
};
