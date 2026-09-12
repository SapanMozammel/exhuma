import type { CSSProperties, ReactNode } from 'react';

export interface NavItem {
	label: string;
	href: string;
	icon?: ReactNode;
	badge?: string | number;
	active?: boolean;
}

export interface HeaderProps {
	brand?: ReactNode;
	navItems?: NavItem[];
	actions?: ReactNode;
	className?: string;
	style?: CSSProperties;
}

export interface FooterProps {
	brand?: ReactNode;
	links?: { label: string; href: string }[];
	copyright?: string;
	className?: string;
	style?: CSSProperties;
}

export interface LandingLayoutProps {
	children: ReactNode;
	header?: ReactNode;
	footer?: ReactNode;
	className?: string;
	style?: CSSProperties;
}

export interface AuthLayoutProps {
	children: ReactNode;
	title?: string;
	subtitle?: string;
	heroContent?: ReactNode;
	brand?: ReactNode;
	split?: boolean;
	className?: string;
	style?: CSSProperties;
}

export interface DashboardLayoutProps {
	children: ReactNode;
	sidebar?: ReactNode;
	header?: ReactNode;
	breadcrumbs?: ReactNode;
	className?: string;
	style?: CSSProperties;
}

export interface ProtectedRouteProps {
	children: ReactNode;
	isAuthenticated: boolean;
	fallback?: ReactNode;
	redirectTo?: string;
}
