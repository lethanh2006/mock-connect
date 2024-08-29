import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { CSSProperties } from 'react';

const AvatarBlog = (props: { url?: string; style?: CSSProperties }) => {
	return (
		<>
			<Avatar
				className={'avatar-class'}
				style={props?.style}
				src={
					props?.url ? (
						<img
							// style={currentUser?.avatar_path ? {} : { objectFit: 'cover' }}
							src={props?.url}
						/>
					) : undefined
				}
				icon={!props?.url ? <UserOutlined /> : undefined}
				alt='avatar'
			/>
		</>
	);
};
export default AvatarBlog;
