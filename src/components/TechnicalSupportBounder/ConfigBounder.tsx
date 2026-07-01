import {
	accentColors,
	highlightColor,
	officialColors,
	primaryColor,
	statusBgColors,
	statusColors,
	textColors,
} from '@/services/base/constant';
import { getIntl, getLocale } from '@umijs/max';
import { ConfigProvider, Empty, Spin } from 'antd';
import { useEffect } from 'react';

const ConfigBounder = (props: { children?: any }) => {
	const intl = getIntl();
	useEffect(() => {
		ConfigProvider.config({
			theme: {
				token: { borderRadius: 4, colorPrimary: primaryColor, colorLink: primaryColor },
				hashed: false,
				cssVar: { prefix: '' },
			},
		});

		Spin.setDefaultIndicator(<div className='circle-loader' />);
	}, [primaryColor]);

	const locale = getLocale();

	return (
		<ConfigProvider
			locale={locale}
			form={{
				requiredMark: false,
			}}
			renderEmpty={() => (
				<Empty
					style={{ marginTop: 32, marginBottom: 32 }}
					image='/images/empty.png'
					description={intl.formatMessage({ id: 'global.table.index.empty' })}
				/>
			)}
			theme={{
				token: {
					borderRadius: 4,
					colorPrimary: primaryColor,
					colorLink: primaryColor,
					controlHeight: 36,
					controlHeightSM: 28,
					colorError: statusColors.status400,
					colorTextDisabled: textColors.text200,
					colorPrimaryBg: officialColors.official500,
				},
				hashed: false,
				cssVar: { prefix: '' },
				components: {
					Anchor: {
						linkPaddingBlock: 12,
					},
					Form: {
						labelRequiredMarkColor: statusColors.status400,
						fontSizeIcon: 20,
					},
					Carousel: {
						dotHeight: 4,
						dotOffset: 10,
						dotWidth: 16,
						dotGap: 4,
						dotActiveWidth: 16,
						arrowOffset: 8,
					},
					Spin: {
						dotSize: 45,
						dotSizeSM: 30,
						dotSizeLG: 60,
					},
					Button: {
						textTextColor: primaryColor,
						defaultColor: textColors.text100,
						borderColorDisabled: 'transparent',
						paddingInline: 10,
						borderRadius: 4,
						fontWeight: 600,
					},
					Progress: {
						defaultColor: statusColors.status200,
					},
					Pagination: {
						colorPrimary: textColors.text400,
						colorPrimaryActive: textColors.text400,
						borderRadius: 4,
						itemActiveBg: primaryColor,
						colorPrimaryBorder: 'transparent',
						colorPrimaryHover: textColors.text400,
						fontWeightStrong: 600,
					},
					DatePicker: {
						colorPrimary: primaryColor,
						borderRadius: 4,
						fontWeightStrong: 700,
						colorTextDisabled: textColors.text100,
					},
					Calendar: {
						itemActiveBg: statusBgColors.statusBg400,
						colorPrimary: primaryColor,
					},
					Modal: {
						headerBg: officialColors.official500,
						headerMarginBottom: 0,
					} as any,
					Steps: {
						colorSplit: accentColors.accent700,
						lineWidth: 2,
						finishIconBgColor: statusColors.status100,
					} as any,
					Slider: {
						trackBg: statusColors.status200,
						handleColor: statusColors.status200,
					},
					Checkbox: {
						colorPrimary: statusColors.status200,
					},
					Switch: {
						colorPrimary: statusColors.status200,
					},
					Input: {
						colorTextDisabled: textColors.text200,
						activeBorderColor: accentColors.accent600,
					},
					Segmented: {
						itemSelectedColor: primaryColor,
						controlHeight: 40,
					},
					Alert: {
						lineType: 'none',
					},
					Collapse: {
						headerPadding: '16px 12px',
						contentPadding: 12,
						headerBg: accentColors.accent700,
					},
					Notification: {
						paddingMD: 12,
						paddingLG: 12,
						paddingContentHorizontalLG: 12,
						fontSizeLG: 14,
					},
					Badge: {
						colorInfo: '#0051FF',
					},
					Avatar: {
						containerSizeLG: 48,
						fontSize: 18,
					},
					Tag: {
						lineType: 'none',
					},
					Radio: {
						colorPrimary: primaryColor,
						radioColor: primaryColor,
						radioBgColor: textColors.text400,
						dotSize: 10,
					} as any,
					Tabs: {
						fontWeightStrong: 600,
						cardBg: officialColors.official500,
						inkBarColor: highlightColor,
						cardGutter: 0,
						horizontalItemPadding: '12px',
						horizontalItemGutter: 8,
					},
					Divider: {
						colorSplit: accentColors.accent700,
						lineWidth: 2,
						orientationMargin: 0,
						textPaddingInline: 2,
						margin: 16,
					},
					Select: {
						optionSelectedColor: primaryColor,
						optionSelectedBg: officialColors.official500,
					},
					Table: {
						borderColor: textColors?.text400,
						headerBg: accentColors?.accent700,
						cellPaddingBlock: 8,
						cellPaddingInline: 8,
						cellPaddingBlockSM: 3,
						cellPaddingInlineSM: 5,
						headerBorderRadius: 0,
					},
					Breadcrumb: {
						lastItemColor: textColors?.text400,
						itemColor: textColors?.text300,
						linkColor: textColors?.text300,
						linkHoverColor: textColors?.text400,
					},
				},
			}}
		>
			{props.children}
		</ConfigProvider>
	);
};

export default ConfigBounder;
