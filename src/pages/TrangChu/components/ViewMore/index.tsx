import '@/styles/global.less';
import React from 'react';
import { useNavigate } from 'umi';
import type { XemTatCaLinkProps } from './typing';

const XemTatCaLink: React.FC<XemTatCaLinkProps> = ({
	to,
	label = 'Xem tất cả',
	onClick,
	color,
	backgroundColor,
	fontSize,
}) => {
	const navigate = useNavigate();

	return (
		<div
			className='xem-tat-ca-link'
			onClick={() => {
				to && navigate(to);
				onClick && onClick();
			}}
		>
			<div
				className='inner'
				style={{
					...(backgroundColor && { backgroundColor }),
				}}
			>
				<span style={{ ...(color && { color }), ...(fontSize && { fontSize }) }}>{label}</span>
			</div>
		</div>
	);
};

export default XemTatCaLink;
