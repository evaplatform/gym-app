interface NotificationColors {
    danger: string;
    warn: string;
    success: string;
    info: string;
}

export interface ThemeColors {
    border: string;
    black: string;
    white: string;
    text: string;
    background: string;
    backgroundSecondary: string;
    backgroundSelected: string;
    tint: string;
    selectedOptions: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
    notification: NotificationColors;
    secondary: string
    shadow: string;
}

export interface IAppColors {
    light: ThemeColors;
    dark: ThemeColors;
}