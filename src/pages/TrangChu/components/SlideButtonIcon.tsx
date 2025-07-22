import React from 'react';

interface ArrowIconProps {
	direction?: 'left' | 'right';
	size?: number;
	disabled?: boolean;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ direction = 'right', size = '100%', disabled = false }) => {
	const ArrowLeft = '/images/arrow-left.png';
	const ArrowRight = '/images/arrow-right.png';
	const src = direction === 'left' ? ArrowLeft : ArrowRight;

	return (
		<img
			src={src}
			alt={direction}
			style={{
				width: size,
				height: size,
				opacity: disabled ? 0.4 : 1,
				transition: 'opacity 0.2s ease-in-out',
			}}
		/>
	);
};

export default ArrowIcon;
