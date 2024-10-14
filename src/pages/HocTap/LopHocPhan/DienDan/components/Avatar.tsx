import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import type { CSSProperties } from 'react';

const AvatarBlog = (props: { url?: string; style?: CSSProperties; name?: string }) => {
	const lastNameChar = props.name?.split(' ')?.at(-1)?.[0];

	return (
		<Avatar
			className={'avatar-class'}
			style={props?.style}
			src={props?.url ? <img alt='avatar' src={props?.url} /> : undefined}
			icon={!props?.url ? lastNameChar ?? <UserOutlined /> : undefined}
			alt='avatar'
		/>
	);
};
export default AvatarBlog;
