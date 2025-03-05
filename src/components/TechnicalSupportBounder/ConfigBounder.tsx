import { primaryColor } from '@/services/base/constant';
import { ConfigProvider } from 'antd';
import { useEffect } from 'react';

const ConfigBounder = (props: { children?: any }) => {
	useEffect(() => {
		// Đổi màu real time => Hỗ trợ đổi tenant
		ConfigProvider.config({
			theme: {
				token: { borderRadius: 4, colorPrimary: primaryColor, colorLink: primaryColor },
				hashed: false,
				cssVar: { prefix: '' },
			},
		});
	}, [primaryColor]);

	return (
		<ConfigProvider
			theme={{
				token: { borderRadius: 4, colorPrimary: primaryColor, colorLink: primaryColor },
				hashed: false,
				cssVar: { prefix: '' },
			}}
		>
			{props.children}
		</ConfigProvider>
	);
};

export default ConfigBounder;
