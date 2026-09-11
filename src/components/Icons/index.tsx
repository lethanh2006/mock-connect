import * as VinUI from '@vinuni/ui';
import React, { forwardRef } from 'react';

/**
 * Kiểu props và component icon chuẩn từ @vinuni/ui
 */
export type IconComponentType<T extends React.ComponentType<any>> = React.ForwardRefExoticComponent<
	React.ComponentPropsWithoutRef<T> & React.RefAttributes<SVGSVGElement>
>;

/**
 * Hàm bọc bắc cầu (bridge) cho toàn bộ icon của @vinuni/ui:
 * - Mặc định size là 16 (thay vì 24), kích hoạt optical master 16px sắc nét chuẩn giao diện bảng & nút bấm.
 * - Cho phép truyền override size bất kỳ (ví dụ: size={20}, size={36}, size={48}).
 */
export function wrapIcon<T extends React.ComponentType<any>>(
	Component: T,
	displayName?: string,
): IconComponentType<T> {
	const WrappedIcon = forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<T>>((props, ref) => {
		const { size = 16, ...rest } = (props as any) || {};
		return <Component ref={ref} size={size} {...rest} />;
	});
	WrappedIcon.displayName = displayName || (Component as any)?.displayName || 'VinIcon';
	return WrappedIcon as unknown as IconComponentType<T>;
}

// Re-export toàn bộ các component và type khác từ @vinuni/ui
export * from '@vinuni/ui';

// Bridge re-exports: Tự động gắn mặc định size={16} cho toàn bộ 203 icons
export const Icon2ChervolLeftLine = wrapIcon(VinUI.Icon2ChervolLeftLine, 'Icon2ChervolLeftLine');
export const Icon2ChervolRightLine = wrapIcon(VinUI.Icon2ChervolRightLine, 'Icon2ChervolRightLine');
export const Icon2LineHorizontal = wrapIcon(VinUI.Icon2LineHorizontal, 'Icon2LineHorizontal');
export const Icon2SquareCopy = wrapIcon(VinUI.Icon2SquareCopy, 'Icon2SquareCopy');
export const Icon3BookMark = wrapIcon(VinUI.Icon3BookMark, 'Icon3BookMark');
export const Icon3Dot3Line = wrapIcon(VinUI.Icon3Dot3Line, 'Icon3Dot3Line');
export const Icon3DotHorizontal = wrapIcon(VinUI.Icon3DotHorizontal, 'Icon3DotHorizontal');
export const Icon3DotVertical = wrapIcon(VinUI.Icon3DotVertical, 'Icon3DotVertical');
export const Icon3LinesDecreasing = wrapIcon(VinUI.Icon3LinesDecreasing, 'Icon3LinesDecreasing');
export const Icon3RectangleVertical = wrapIcon(VinUI.Icon3RectangleVertical, 'Icon3RectangleVertical');
export const Icon3SquarePlusmark = wrapIcon(VinUI.Icon3SquarePlusmark, 'Icon3SquarePlusmark');
export const Icon4RectangleGrid = wrapIcon(VinUI.Icon4RectangleGrid, 'Icon4RectangleGrid');
export const Icon4SquareGrid = wrapIcon(VinUI.Icon4SquareGrid, 'Icon4SquareGrid');
export const Icon6DotGridHorizontal = wrapIcon(VinUI.Icon6DotGridHorizontal, 'Icon6DotGridHorizontal');
export const Icon6DotGridVertical = wrapIcon(VinUI.Icon6DotGridVertical, 'Icon6DotGridVertical');
export const Icon9SquareGrid = wrapIcon(VinUI.Icon9SquareGrid, 'Icon9SquareGrid');
export const IconAlarmClock = wrapIcon(VinUI.IconAlarmClock, 'IconAlarmClock');
export const IconArrowBack = wrapIcon(VinUI.IconArrowBack, 'IconArrowBack');
export const IconArrowDown = wrapIcon(VinUI.IconArrowDown, 'IconArrowDown');
export const IconArrowLeft = wrapIcon(VinUI.IconArrowLeft, 'IconArrowLeft');
export const IconArrowRight = wrapIcon(VinUI.IconArrowRight, 'IconArrowRight');
export const IconArrowTopright = wrapIcon(VinUI.IconArrowTopright, 'IconArrowTopright');
export const IconArrowUp = wrapIcon(VinUI.IconArrowUp, 'IconArrowUp');
export const IconArrowdownSquare = wrapIcon(VinUI.IconArrowdownSquare, 'IconArrowdownSquare');
export const IconAuctionHammer = wrapIcon(VinUI.IconAuctionHammer, 'IconAuctionHammer');
export const IconBankCard = wrapIcon(VinUI.IconBankCard, 'IconBankCard');
export const IconBankCardInfo = wrapIcon(VinUI.IconBankCardInfo, 'IconBankCardInfo');
export const IconBarbell01 = wrapIcon(VinUI.IconBarbell01, 'IconBarbell01');
export const IconBasketball01 = wrapIcon(VinUI.IconBasketball01, 'IconBasketball01');
export const IconBell = wrapIcon(VinUI.IconBell, 'IconBell');
export const IconBellFill = wrapIcon(VinUI.IconBellFill, 'IconBellFill');
export const IconBoard = wrapIcon(VinUI.IconBoard, 'IconBoard');
export const IconBookApple = wrapIcon(VinUI.IconBookApple, 'IconBookApple');
export const IconBookBookmark01 = wrapIcon(VinUI.IconBookBookmark01, 'IconBookBookmark01');
export const IconBookHuman = wrapIcon(VinUI.IconBookHuman, 'IconBookHuman');
export const IconBookMortarboard = wrapIcon(VinUI.IconBookMortarboard, 'IconBookMortarboard');
export const IconBookOpen = wrapIcon(VinUI.IconBookOpen, 'IconBookOpen');
export const IconBookOpen02 = wrapIcon(VinUI.IconBookOpen02, 'IconBookOpen02');
export const IconBookmark = wrapIcon(VinUI.IconBookmark, 'IconBookmark');
export const IconBriefcase = wrapIcon(VinUI.IconBriefcase, 'IconBriefcase');
export const IconBriefcaseHealth = wrapIcon(VinUI.IconBriefcaseHealth, 'IconBriefcaseHealth');
export const IconBubbleChat = wrapIcon(VinUI.IconBubbleChat, 'IconBubbleChat');
export const IconCalendar = wrapIcon(VinUI.IconCalendar, 'IconCalendar');
export const IconCalendarEmpty = wrapIcon(VinUI.IconCalendarEmpty, 'IconCalendarEmpty');
export const IconCalendarFill = wrapIcon(VinUI.IconCalendarFill, 'IconCalendarFill');
export const IconCalendarStar = wrapIcon(VinUI.IconCalendarStar, 'IconCalendarStar');
export const IconChartRing = wrapIcon(VinUI.IconChartRing, 'IconChartRing');
export const IconChat2BubbleRectagle = wrapIcon(VinUI.IconChat2BubbleRectagle, 'IconChat2BubbleRectagle');
export const IconChatBubbleRectagle = wrapIcon(VinUI.IconChatBubbleRectagle, 'IconChatBubbleRectagle');
export const IconChatBubbleRectagleWrench = wrapIcon(VinUI.IconChatBubbleRectagleWrench, 'IconChatBubbleRectagleWrench');
export const IconCheck = wrapIcon(VinUI.IconCheck, 'IconCheck');
export const IconCheckCircle = wrapIcon(VinUI.IconCheckCircle, 'IconCheckCircle');
export const IconCheckMini = wrapIcon(VinUI.IconCheckMini, 'IconCheckMini');
export const IconCheckSquare = wrapIcon(VinUI.IconCheckSquare, 'IconCheckSquare');
export const IconCheckmarkBadge01 = wrapIcon(VinUI.IconCheckmarkBadge01, 'IconCheckmarkBadge01');
export const IconCheckmarkBadge01Fill = wrapIcon(VinUI.IconCheckmarkBadge01Fill, 'IconCheckmarkBadge01Fill');
export const IconChervolDown = wrapIcon(VinUI.IconChervolDown, 'IconChervolDown');
export const IconChervolLeft = wrapIcon(VinUI.IconChervolLeft, 'IconChervolLeft');
export const IconChervolLeftLine = wrapIcon(VinUI.IconChervolLeftLine, 'IconChervolLeftLine');
export const IconChervolRight = wrapIcon(VinUI.IconChervolRight, 'IconChervolRight');
export const IconChervolRightLine = wrapIcon(VinUI.IconChervolRightLine, 'IconChervolRightLine');
export const IconChervolUp = wrapIcon(VinUI.IconChervolUp, 'IconChervolUp');
export const IconClipboardLogo = wrapIcon(VinUI.IconClipboardLogo, 'IconClipboardLogo');
export const IconClock = wrapIcon(VinUI.IconClock, 'IconClock');
export const IconClockArrowDashRotate = wrapIcon(VinUI.IconClockArrowDashRotate, 'IconClockArrowDashRotate');
export const IconDiploma = wrapIcon(VinUI.IconDiploma, 'IconDiploma');
export const IconDoor01 = wrapIcon(VinUI.IconDoor01, 'IconDoor01');
export const IconDoubleCheck = wrapIcon(VinUI.IconDoubleCheck, 'IconDoubleCheck');
export const IconDoubleHumanCard = wrapIcon(VinUI.IconDoubleHumanCard, 'IconDoubleHumanCard');
export const IconDownload = wrapIcon(VinUI.IconDownload, 'IconDownload');
export const IconDownloadCircle = wrapIcon(VinUI.IconDownloadCircle, 'IconDownloadCircle');
export const IconDropDown = wrapIcon(VinUI.IconDropDown, 'IconDropDown');
export const IconDropUp = wrapIcon(VinUI.IconDropUp, 'IconDropUp');
export const IconEarth = wrapIcon(VinUI.IconEarth, 'IconEarth');
export const IconEarthLongitude = wrapIcon(VinUI.IconEarthLongitude, 'IconEarthLongitude');
export const IconEarthLongitudeLefttoparrow = wrapIcon(VinUI.IconEarthLongitudeLefttoparrow, 'IconEarthLongitudeLefttoparrow');
export const IconEmojiInLove = wrapIcon(VinUI.IconEmojiInLove, 'IconEmojiInLove');
export const IconEmojiNeutral = wrapIcon(VinUI.IconEmojiNeutral, 'IconEmojiNeutral');
export const IconEmojiSad1 = wrapIcon(VinUI.IconEmojiSad1, 'IconEmojiSad1');
export const IconEthicsSymbol = wrapIcon(VinUI.IconEthicsSymbol, 'IconEthicsSymbol');
export const IconEye = wrapIcon(VinUI.IconEye, 'IconEye');
export const IconEye1 = wrapIcon(VinUI.IconEye1, 'IconEye1');
export const IconEyeSlash = wrapIcon(VinUI.IconEyeSlash, 'IconEyeSlash');
export const IconFile = wrapIcon(VinUI.IconFile, 'IconFile');
export const IconFileA = wrapIcon(VinUI.IconFileA, 'IconFileA');
export const IconFileCheck = wrapIcon(VinUI.IconFileCheck, 'IconFileCheck');
export const IconFileCheckPen = wrapIcon(VinUI.IconFileCheckPen, 'IconFileCheckPen');
export const IconFileClipHuman = wrapIcon(VinUI.IconFileClipHuman, 'IconFileClipHuman');
export const IconFileClock = wrapIcon(VinUI.IconFileClock, 'IconFileClock');
export const IconFileGear = wrapIcon(VinUI.IconFileGear, 'IconFileGear');
export const IconFileMoney = wrapIcon(VinUI.IconFileMoney, 'IconFileMoney');
export const IconFileMoneyInfo = wrapIcon(VinUI.IconFileMoneyInfo, 'IconFileMoneyInfo');
export const IconFilePen = wrapIcon(VinUI.IconFilePen, 'IconFilePen');
export const IconFileStar = wrapIcon(VinUI.IconFileStar, 'IconFileStar');
export const IconFileTen = wrapIcon(VinUI.IconFileTen, 'IconFileTen');
export const IconFileXmark = wrapIcon(VinUI.IconFileXmark, 'IconFileXmark');
export const IconFilter = wrapIcon(VinUI.IconFilter, 'IconFilter');
export const IconFolder = wrapIcon(VinUI.IconFolder, 'IconFolder');
export const IconFootball01 = wrapIcon(VinUI.IconFootball01, 'IconFootball01');
export const IconForward = wrapIcon(VinUI.IconForward, 'IconForward');
export const IconFrontCamera = wrapIcon(VinUI.IconFrontCamera, 'IconFrontCamera');
export const IconGear = wrapIcon(VinUI.IconGear, 'IconGear');
export const IconGift = wrapIcon(VinUI.IconGift, 'IconGift');
export const IconGiftCard = wrapIcon(VinUI.IconGiftCard, 'IconGiftCard');
export const IconGraduationScroll = wrapIcon(VinUI.IconGraduationScroll, 'IconGraduationScroll');
export const IconHandGear = wrapIcon(VinUI.IconHandGear, 'IconHandGear');
export const IconHandHeart = wrapIcon(VinUI.IconHandHeart, 'IconHandHeart');
export const IconHandshare = wrapIcon(VinUI.IconHandshare, 'IconHandshare');
export const IconHeadphone = wrapIcon(VinUI.IconHeadphone, 'IconHeadphone');
export const IconHealthSquare = wrapIcon(VinUI.IconHealthSquare, 'IconHealthSquare');
export const IconHeart = wrapIcon(VinUI.IconHeart, 'IconHeart');
export const IconHeartFill = wrapIcon(VinUI.IconHeartFill, 'IconHeartFill');
export const IconHourglass = wrapIcon(VinUI.IconHourglass, 'IconHourglass');
export const IconHuman = wrapIcon(VinUI.IconHuman, 'IconHuman');
export const IconHumanBoard = wrapIcon(VinUI.IconHumanBoard, 'IconHumanBoard');
export const IconHumanCard = wrapIcon(VinUI.IconHumanCard, 'IconHumanCard');
export const IconHumanCardArrowUp = wrapIcon(VinUI.IconHumanCardArrowUp, 'IconHumanCardArrowUp');
export const IconHumanCheck = wrapIcon(VinUI.IconHumanCheck, 'IconHumanCheck');
export const IconHumanCircle = wrapIcon(VinUI.IconHumanCircle, 'IconHumanCircle');
export const IconHumanCircleFill = wrapIcon(VinUI.IconHumanCircleFill, 'IconHumanCircleFill');
export const IconHumanPen = wrapIcon(VinUI.IconHumanPen, 'IconHumanPen');
export const IconHumberger = wrapIcon(VinUI.IconHumberger, 'IconHumberger');
export const IconInfoCircle = wrapIcon(VinUI.IconInfoCircle, 'IconInfoCircle');
export const IconLeafHalfGear = wrapIcon(VinUI.IconLeafHalfGear, 'IconLeafHalfGear');
export const IconLeftBar = wrapIcon(VinUI.IconLeftBar, 'IconLeftBar');
export const IconLeftRightBar = wrapIcon(VinUI.IconLeftRightBar, 'IconLeftRightBar');
export const IconLightBulbOn = wrapIcon(VinUI.IconLightBulbOn, 'IconLightBulbOn');
export const IconLockClose = wrapIcon(VinUI.IconLockClose, 'IconLockClose');
export const IconLockOpen = wrapIcon(VinUI.IconLockOpen, 'IconLockOpen');
export const IconLogoMicrosoft = wrapIcon(VinUI.IconLogoMicrosoft, 'IconLogoMicrosoft');
export const IconLogoMicrosoftTeam = wrapIcon(VinUI.IconLogoMicrosoftTeam, 'IconLogoMicrosoftTeam');
export const IconLongtext = wrapIcon(VinUI.IconLongtext, 'IconLongtext');
export const IconMagnifyingglass = wrapIcon(VinUI.IconMagnifyingglass, 'IconMagnifyingglass');
export const IconMail = wrapIcon(VinUI.IconMail, 'IconMail');
export const IconMedal01 = wrapIcon(VinUI.IconMedal01, 'IconMedal01');
export const IconMicrophoneFill = wrapIcon(VinUI.IconMicrophoneFill, 'IconMicrophoneFill');
export const IconMiniSquare45Dot = wrapIcon(VinUI.IconMiniSquare45Dot, 'IconMiniSquare45Dot');
export const IconMinusMini = wrapIcon(VinUI.IconMinusMini, 'IconMinusMini');
export const IconMixer = wrapIcon(VinUI.IconMixer, 'IconMixer');
export const IconMobile = wrapIcon(VinUI.IconMobile, 'IconMobile');
export const IconMoneyScroll = wrapIcon(VinUI.IconMoneyScroll, 'IconMoneyScroll');
export const IconMoon = wrapIcon(VinUI.IconMoon, 'IconMoon');
export const IconMortarboard = wrapIcon(VinUI.IconMortarboard, 'IconMortarboard');
export const IconNews = wrapIcon(VinUI.IconNews, 'IconNews');
export const IconNewsStar = wrapIcon(VinUI.IconNewsStar, 'IconNewsStar');
export const IconNotebook01 = wrapIcon(VinUI.IconNotebook01, 'IconNotebook01');
export const IconNotebook02 = wrapIcon(VinUI.IconNotebook02, 'IconNotebook02');
export const IconOpenrectagleRightarrow = wrapIcon(VinUI.IconOpenrectagleRightarrow, 'IconOpenrectagleRightarrow');
export const IconOpenrectagleToprightarrow = wrapIcon(VinUI.IconOpenrectagleToprightarrow, 'IconOpenrectagleToprightarrow');
export const IconOpenrectagleUparrow = wrapIcon(VinUI.IconOpenrectagleUparrow, 'IconOpenrectagleUparrow');
export const IconPaperClip45Degree = wrapIcon(VinUI.IconPaperClip45Degree, 'IconPaperClip45Degree');
export const IconPen = wrapIcon(VinUI.IconPen, 'IconPen');
export const IconPenSquare = wrapIcon(VinUI.IconPenSquare, 'IconPenSquare');
export const IconPeople = wrapIcon(VinUI.IconPeople, 'IconPeople');
export const IconPhone = wrapIcon(VinUI.IconPhone, 'IconPhone');
export const IconPhoto = wrapIcon(VinUI.IconPhoto, 'IconPhoto');
export const IconPhotoArrowdown = wrapIcon(VinUI.IconPhotoArrowdown, 'IconPhotoArrowdown');
export const IconPhotoArrowup = wrapIcon(VinUI.IconPhotoArrowup, 'IconPhotoArrowup');
export const IconPickleball01 = wrapIcon(VinUI.IconPickleball01, 'IconPickleball01');
export const IconPinLocation = wrapIcon(VinUI.IconPinLocation, 'IconPinLocation');
export const IconPlus = wrapIcon(VinUI.IconPlus, 'IconPlus');
export const IconPlusMini = wrapIcon(VinUI.IconPlusMini, 'IconPlusMini');
export const IconPoliceBadge = wrapIcon(VinUI.IconPoliceBadge, 'IconPoliceBadge');
export const IconPuzzle = wrapIcon(VinUI.IconPuzzle, 'IconPuzzle');
export const IconQrCode = wrapIcon(VinUI.IconQrCode, 'IconQrCode');
export const IconQuestionCircle = wrapIcon(VinUI.IconQuestionCircle, 'IconQuestionCircle');
export const IconRadiobox = wrapIcon(VinUI.IconRadiobox, 'IconRadiobox');
export const IconRightBar = wrapIcon(VinUI.IconRightBar, 'IconRightBar');
export const IconRoofedHouse = wrapIcon(VinUI.IconRoofedHouse, 'IconRoofedHouse');
export const IconRoofedHouseFill = wrapIcon(VinUI.IconRoofedHouseFill, 'IconRoofedHouseFill');
export const IconRotateArrow = wrapIcon(VinUI.IconRotateArrow, 'IconRotateArrow');
export const IconRotateArrowRectangle = wrapIcon(VinUI.IconRotateArrowRectangle, 'IconRotateArrowRectangle');
export const IconScanIndicator = wrapIcon(VinUI.IconScanIndicator, 'IconScanIndicator');
export const IconSend = wrapIcon(VinUI.IconSend, 'IconSend');
export const IconShieldCheck = wrapIcon(VinUI.IconShieldCheck, 'IconShieldCheck');
export const IconShieldInfo = wrapIcon(VinUI.IconShieldInfo, 'IconShieldInfo');
export const IconShippingbox = wrapIcon(VinUI.IconShippingbox, 'IconShippingbox');
export const IconShoppingbag = wrapIcon(VinUI.IconShoppingbag, 'IconShoppingbag');
export const IconShorttext = wrapIcon(VinUI.IconShorttext, 'IconShorttext');
export const IconSideCamera = wrapIcon(VinUI.IconSideCamera, 'IconSideCamera');
export const IconStar = wrapIcon(VinUI.IconStar, 'IconStar');
export const IconStarBadge = wrapIcon(VinUI.IconStarBadge, 'IconStarBadge');
export const IconStarFill = wrapIcon(VinUI.IconStarFill, 'IconStarFill');
export const IconStopwatch = wrapIcon(VinUI.IconStopwatch, 'IconStopwatch');
export const IconSun = wrapIcon(VinUI.IconSun, 'IconSun');
export const IconSwimming01 = wrapIcon(VinUI.IconSwimming01, 'IconSwimming01');
export const IconTennisBall01 = wrapIcon(VinUI.IconTennisBall01, 'IconTennisBall01');
export const IconTrash = wrapIcon(VinUI.IconTrash, 'IconTrash');
export const IconUpload = wrapIcon(VinUI.IconUpload, 'IconUpload');
export const IconVinuniSymbol = wrapIcon(VinUI.IconVinuniSymbol, 'IconVinuniSymbol');
export const IconVinuniSymbolLine = wrapIcon(VinUI.IconVinuniSymbolLine, 'IconVinuniSymbolLine');
export const IconWarningCircle = wrapIcon(VinUI.IconWarningCircle, 'IconWarningCircle');
export const IconWarningTriangle = wrapIcon(VinUI.IconWarningTriangle, 'IconWarningTriangle');
export const IconWordB = wrapIcon(VinUI.IconWordB, 'IconWordB');
export const IconWordIItalic = wrapIcon(VinUI.IconWordIItalic, 'IconWordIItalic');
export const IconWordT = wrapIcon(VinUI.IconWordT, 'IconWordT');
export const IconWrench01 = wrapIcon(VinUI.IconWrench01, 'IconWrench01');
export const IconWrenchGear01 = wrapIcon(VinUI.IconWrenchGear01, 'IconWrenchGear01');
export const IconXmark = wrapIcon(VinUI.IconXmark, 'IconXmark');
export const IconXmarkCircle = wrapIcon(VinUI.IconXmarkCircle, 'IconXmarkCircle');
export const IconXmarkCircleFill = wrapIcon(VinUI.IconXmarkCircleFill, 'IconXmarkCircleFill');
export const IconXmarkMedium = wrapIcon(VinUI.IconXmarkMedium, 'IconXmarkMedium');
export const IconXmarkPentagon = wrapIcon(VinUI.IconXmarkPentagon, 'IconXmarkPentagon');

// =============================================================================
// Icon Bridge Aliases (Đồng bộ với từ điển Mapping Icon VinUni UI)
// =============================================================================
export const IconEyeOpen = IconEye;
export const IconEyeClose = IconEyeSlash;
export const IconCheck01 = IconCheck;
export const IconFilter01 = IconFilter;
export const IconMagnifyingGlass = IconMagnifyingglass;
export const IconDocument = IconFile;
export const IconPencil01 = IconPen;
export const IconMail01 = IconMail;
export const IconPhoneCall = IconPhone;
export const IconFolder01 = IconFolder;
export const IconSave = IconFileCheckPen;
export const IconShare01 = IconForward;
export const IconLink01 = IconPaperClip45Degree;
export const IconPrinter = IconFile;

