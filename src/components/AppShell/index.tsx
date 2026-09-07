import AvatarDropdown from '@/components/RightContent/AvatarDropdown';
import ModuleSwitch from '@/components/RightContent/ModuleSwitch';
import NoticeIconView from '@/components/RightContent/NoticeIcon';
import { AppModules } from '@/services/base/constant';
import { currentRole } from '@/utils/ip';
import {
	IconChervolDown,
	Sidebar,
	SidebarBanner,
	SidebarContent,
	SidebarDock,
	SidebarDockBrand,
	SidebarDockFooter,
	SidebarDockNav,
	SidebarDockSwitcher,
	SidebarDockSwitcherItem,
	SidebarDockThemeToggle,
	SidebarDockToggle,
	SidebarDockViews,
	SidebarDockWordmark,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
} from '@/components/Icons';
import { Collapsible } from 'radix-ui';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { getLocale, history, setLocale, useIntl, useLocation } from 'umi';
import { getNavSections, type NavNode } from './nav';
import './style.less';

const LocaleDockSwitcher = () => {
	const locale = getLocale();

	return (
		<SidebarDockSwitcher
			value={locale}
			onValueChange={(value) => {
				if (value && value !== locale) setLocale(value, true);
			}}
		>
			<SidebarDockSwitcherItem value='vi-VN' aria-label='Tiếng Việt'>
				VI
			</SidebarDockSwitcherItem>
			<SidebarDockSwitcherItem value='en-US' aria-label='English'>
				EN
			</SidebarDockSwitcherItem>
		</SidebarDockSwitcher>
	);
};

const isNodeActive = (node: NavNode, pathname: string): boolean =>
	pathname === node.path || pathname.startsWith(`${node.path}/`);

/** Như `isNodeActive` nhưng đi xuống hết cây con — cần cho menu sâu hơn 2 cấp, để group tổ tiên tự mở khi route đang active nằm ở cấp cháu. */
const hasActiveDescendant = (node: NavNode, pathname: string): boolean =>
	isNodeActive(node, pathname) || (node.children?.some((child) => hasActiveDescendant(child, pathname)) ?? false);

/**
 * Dùng làm children của `SidebarMenuButton`/`SidebarMenuSubButton` khi `asChild` —
 * Radix `Slot` merge className, data-attrs, ref vào thẳng phần tử này, nên phải
 * nhận `...rest` và `ref` rồi gắn lên `<a>`, nếu không class của thư viện sẽ rơi mất.
 */
const NavLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'> & { node: NavNode; showIcon?: boolean }>(
	({ node, showIcon = true, onClick, ...rest }, ref) => {
		const intl = useIntl();

		return (
			<a
				ref={ref}
				href={node.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(node.path);
					onClick?.(e);
				}}
				{...rest}
			>
				{showIcon && node.icon}
				<span>{intl.formatMessage({ id: node.localeId, defaultMessage: node.name })}</span>
			</a>
		);
	},
);
NavLink.displayName = 'NavLink';

const NavMenuItem = ({ node, pathname }: { node: NavNode; pathname: string }) => (
	<SidebarMenuItem>
		<SidebarMenuButton asChild isActive={isNodeActive(node, pathname)}>
			<NavLink node={node} />
		</SidebarMenuButton>
	</SidebarMenuItem>
);

/** Item cấp gốc có children — accordion mở/đóng tại chỗ, giống menu PTIT. */
const NavMenuGroupItem = ({ node, pathname }: { node: NavNode; pathname: string }) => {
	const intl = useIntl();
	const children = node.children ?? [];
	const hasActiveChild = children.some((child) => hasActiveDescendant(child, pathname));
	const [open, setOpen] = useState(hasActiveChild);

	useEffect(() => {
		if (hasActiveChild) setOpen(true);
	}, [hasActiveChild]);

	return (
		<Collapsible.Root open={open} onOpenChange={setOpen}>
			<SidebarMenuItem>
				<Collapsible.Trigger asChild>
					<SidebarMenuButton isActive={hasActiveChild && !open}>
						{node.icon}
						<span>{intl.formatMessage({ id: node.localeId, defaultMessage: node.name })}</span>
						<IconChervolDown
							aria-hidden
							className={`app-shell-chevron ${open ? 'open' : ''}`}
						/>
					</SidebarMenuButton>
				</Collapsible.Trigger>
				<Collapsible.Content>
					<SidebarMenuSub>
						{children.map((child) => (
							<NavSubNode key={child.path} node={child} pathname={pathname} />
						))}
					</SidebarMenuSub>
				</Collapsible.Content>
			</SidebarMenuItem>
		</Collapsible.Root>
	);
};

/** Item lá bên trong `SidebarMenuSub` (cấp 3 trở lên). */
const NavSubLeaf = ({ node, pathname }: { node: NavNode; pathname: string }) => (
	<SidebarMenuSubItem>
		<SidebarMenuSubButton asChild isActive={isNodeActive(node, pathname)} className='pl-11'>
			<NavLink node={node} showIcon={false} />
		</SidebarMenuSubButton>
	</SidebarMenuSubItem>
);

/**
 * Item có children bên trong `SidebarMenuSub` — cùng cơ chế accordion với
 * `NavMenuGroupItem` nhưng lồng một `SidebarMenuSub` nữa, nên menu sâu bao
 * nhiêu cấp cũng mở được (routes.ts có chỗ lồng tới cấp 4).
 */
const NavSubGroup = ({ node, pathname }: { node: NavNode; pathname: string }) => {
	const intl = useIntl();
	const children = node.children ?? [];
	const hasActiveChild = children.some((child) => hasActiveDescendant(child, pathname));
	const [open, setOpen] = useState(hasActiveChild);

	useEffect(() => {
		if (hasActiveChild) setOpen(true);
	}, [hasActiveChild]);

	return (
		<Collapsible.Root open={open} onOpenChange={setOpen}>
			<SidebarMenuSubItem>
				<Collapsible.Trigger asChild>
					<SidebarMenuSubButton asChild isActive={hasActiveChild && !open} className='pl-11'>
						<button type='button'>
							<span>{intl.formatMessage({ id: node.localeId, defaultMessage: node.name })}</span>
							<IconChervolDown
								aria-hidden
								className={`app-shell-chevron ${open ? 'open' : ''}`}
							/>
						</button>
					</SidebarMenuSubButton>
				</Collapsible.Trigger>
				<Collapsible.Content>
					<SidebarMenuSub>
						{children.map((child) => (
							<NavSubNode key={child.path} node={child} pathname={pathname} />
						))}
					</SidebarMenuSub>
				</Collapsible.Content>
			</SidebarMenuSubItem>
		</Collapsible.Root>
	);
};

const NavSubNode = ({ node, pathname }: { node: NavNode; pathname: string }) =>
	node.children ? <NavSubGroup node={node} pathname={pathname} /> : <NavSubLeaf node={node} pathname={pathname} />;

const NavMenuNode = ({ node, pathname }: { node: NavNode; pathname: string }) =>
	node.children ? (
		<NavMenuGroupItem node={node} pathname={pathname} />
	) : (
		<NavMenuItem node={node} pathname={pathname} />
	);

const AppShell = ({ children }: { children: ReactNode }) => {
	const intl = useIntl();
	const { pathname } = useLocation();
	const sections = useMemo(() => getNavSections(), []);
	const appTitle = intl.formatMessage({ id: AppModules[currentRole].title });

	return (
		<SidebarProvider>
			<SidebarDockViews>
				<SidebarDock>
					<SidebarDockBrand />
					<SidebarDockNav className='app-shell-dock-nav'>
						<SidebarDockToggle />
						<NoticeIconView />
						<ModuleSwitch />
					</SidebarDockNav>
					<SidebarDockWordmark />
					<SidebarDockFooter>
						<SidebarDockThemeToggle />
						<LocaleDockSwitcher />
					</SidebarDockFooter>
				</SidebarDock>

				<Sidebar collapsible='offcanvas'>
					<SidebarHeader>
						{/* <SidebarTitle className='font-heading'>{appTitle}</SidebarTitle> */}
						<SidebarBanner projectName={appTitle} />
					</SidebarHeader>

					<SidebarContent>
						{sections.map((section) => (
							<SidebarGroup key={section.id} style={{ paddingTop: 4, paddingBottom: 4 }}>
								{section.localeId && (
									<SidebarGroupLabel style={{ paddingTop: 4, paddingBottom: 4 }}>
										{intl.formatMessage({ id: section.localeId, defaultMessage: section.id })}
									</SidebarGroupLabel>
								)}
								<SidebarGroupContent>
									<SidebarMenu>
										{section.items.map((node) => (
											<NavMenuNode key={node.path} node={node} pathname={pathname} />
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						))}
					</SidebarContent>

					<SidebarFooter>
						<AvatarDropdown />
					</SidebarFooter>
				</Sidebar>

				<SidebarInset style={{ minWidth: 0 }}>
					<div className='app-shell-content'>{children}</div>
				</SidebarInset>
			</SidebarDockViews>
		</SidebarProvider>
	);
};

export default AppShell;
