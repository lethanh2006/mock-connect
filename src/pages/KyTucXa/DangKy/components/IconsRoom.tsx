import React from 'react';
import cachBoTriImg from '@/assets/KyTucXa/cachBoTri.png';
import dienTichImg from '@/assets/KyTucXa/dienTich.png';

export const CheckIconCustom: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 16 16'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path
			d='M7.39274 1.53956C7.77997 1.32015 8.25454 1.32015 8.64177 1.53956L9.30778 1.91652C9.4981 2.02432 9.71307 2.08156 9.93181 2.08156H10.6242C11.0737 2.08156 11.4898 2.31967 11.717 2.70753L12.1027 3.36671C12.2174 3.56262 12.3827 3.72438 12.5812 3.83449L13.2404 4.19972C13.6428 4.42288 13.8927 4.84702 13.8927 5.30714V6.05617C13.8927 6.27315 13.9487 6.48705 14.0549 6.67628L14.465 7.40773C14.685 7.79978 14.6804 8.27954 14.4533 8.66749L14.0666 9.32863C13.953 9.52256 13.8928 9.74355 13.8927 9.96827V10.6665C13.8926 11.1106 13.66 11.5226 13.2795 11.7515L12.6232 12.146C12.4417 12.2553 12.2908 12.4085 12.1838 12.5913L11.7697 13.2974C11.5511 13.6707 11.157 13.907 10.7248 13.9234L9.8947 13.9546C9.69944 13.962 9.50867 14.0145 9.33708 14.1079L8.62321 14.4966C8.24556 14.7024 7.78895 14.7024 7.4113 14.4966L6.69841 14.1079C6.52631 14.0142 6.33469 13.9618 6.13884 13.9546L5.24235 13.9224C4.80946 13.9066 4.41435 13.6702 4.19548 13.2964L3.77653 12.5816C3.67301 12.4048 3.52846 12.2555 3.35466 12.147L2.66911 11.7193C2.29837 11.488 2.07341 11.082 2.07341 10.645V9.92921C2.07334 9.70741 2.01424 9.48955 1.90349 9.29738L1.54021 8.66652C1.31681 8.2789 1.31463 7.80135 1.53435 7.41163L1.92204 6.72413C2.02121 6.54811 2.07675 6.35084 2.08415 6.14894L2.11638 5.25538C2.13204 4.82344 2.36693 4.42873 2.73942 4.20949L3.43376 3.80128C3.62243 3.69026 3.77947 3.53193 3.88884 3.3423L4.25017 2.71535C4.47615 2.32324 4.8943 2.0817 5.34685 2.08156H6.10271C6.32146 2.08156 6.53639 2.02435 6.72673 1.91652L7.39274 1.53956ZM11.0802 5.91066C10.8179 5.64561 10.3902 5.64347 10.1252 5.90577L7.28044 8.7212L5.83122 7.34718C5.56054 7.09075 5.13266 7.10202 4.87614 7.37257C4.61965 7.64332 4.63176 8.07115 4.90251 8.32765L6.82634 10.1509C7.09083 10.4015 7.5067 10.3972 7.76579 10.1411L11.0754 6.86574C11.3403 6.60343 11.3424 6.17572 11.0802 5.91066Z'
			fill='currentColor'
		/>
	</svg>
);

export const FilterIconCustom: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
	<div
		style={{
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			padding: 6,
			gap: 10,
			width: 28,
			height: 28,
			border: '1px dashed #D2D3D5',
			borderRadius: 4,
			flex: 'none',
			order: 0,
			flexGrow: 0,
		}}
		{...props}
	>
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M1.86719 2.53125H12.1339" stroke="#2E2E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M3.74609 5.32812H10.2567" stroke="#2E2E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M5.74805 8.13281H8.25211" stroke="#2E2E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M11.334 7.86719V13.4672" stroke="#2E2E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M8.5332 10.6641H14.1332" stroke="#2E2E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	</div>
);

export const ExpandIconCustom: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
	<img
		src={cachBoTriImg}
		alt='Cach bo tri'
		style={{ width: 18, height: 18, objectFit: 'contain' }}
		{...props}
	/>
);
export const DienTichIconCustom: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
	<img
		src={dienTichImg}
		alt='Dien tich'
		style={{ width: 18, height: 18, objectFit: 'contain' }}
		{...props}
	/>
);