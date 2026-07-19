import { type TinTucWP } from '@/services/TinTuc/typing';
import { Typography } from 'antd';
import DOMPurify from 'dompurify';

interface Props {
	data?: TinTucWP.IRecord;
	rows?: number;
	style?: any;
}

export const Title = ({ data, rows, style }: Props) => {
	return (
		<Typography.Paragraph ellipsis={{ rows, expandable: false }} style={style}>
			<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.title?.rendered ?? '') }} />
		</Typography.Paragraph>
	);
};
