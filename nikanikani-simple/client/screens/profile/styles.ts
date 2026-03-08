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
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    userName: {
      marginBottom: Spacing.xs,
    },
    deviceId: {
      fontSize: 12,
      color: theme.textMuted,
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
      marginBottom: Spacing.xs,
    },
    cardSubtitle: {
      fontSize: 14,
    },
    section: {
      marginTop: Spacing.lg,
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
    },
    settingItem: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    settingInfo: {
      flex: 1,
    },
    settingSubtitle: {
      marginTop: 2,
    },
    footer: {
      alignItems: 'center',
      marginTop: Spacing['2xl'],
      marginBottom: Spacing.lg,
    },
  });
};
