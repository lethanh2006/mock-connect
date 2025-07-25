import React from 'react';

interface ArrowIconProps {
	direction?: 'left' | 'right';
	size?: number | string;
	disabled?: boolean;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ direction = 'right', size = '100%', disabled = false }) => {
	const isLeft = direction === 'left';

	return (
		<img
			src='images/arrow-right.svg'
			alt={direction}
			style={{
				width: size,
				height: size,
				opacity: disabled ? 0.4 : 1,
				transition: 'opacity 0.2s ease-in-out',
				transform: isLeft ? 'scaleX(-1)' : undefined,
			}}
		/>
	);
};

export default ArrowIcon;
