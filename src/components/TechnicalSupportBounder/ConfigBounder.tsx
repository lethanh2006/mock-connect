import { primaryColor } from '@/services/base/constant';
import { ConfigProvider } from 'antd';
import { useEffect } from 'react';

/** Chú ý các route để layout: false thì phải bọc bởi ConfigBound để nhận styles */
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
				components: {
					Carousel: {
						dotHeight: 5,
						dotOffset: 0, // khoảng cách từ bottom
					},
				},
			}}
		>
			{props.children}
		</ConfigProvider>
	);
};

export default ConfigBounder;
