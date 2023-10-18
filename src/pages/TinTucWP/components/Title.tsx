import { type TinTucWP } from '@/services/TinTuc/typing';
import { Typography } from 'antd';

interface Props {
	data?: TinTucWP.IRecord;
	rows?: number;
	style?: any;
}

export const Title = ({ data, rows, style }: Props) => {
	return (
		<Typography.Paragraph ellipsis={{ rows, expandable: false }} style={style}>
			<div dangerouslySetInnerHTML={{ __html: data?.title?.rendered ?? '' }} />
		</Typography.Paragraph>
	);
};
