import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { getNameFile } from '@/utils/utils';
import { IconFile, IconDocument } from '@/components/Icons';
import { Button } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

const PrimaryColor = APP_CONFIG_PRIMARY_COLOR;

const BoxFileWrapper = styled.div`
	.box-file {
		display: flex;
		padding: 8px;
		border: 1px solid #f0f0f0;
		border-radius: 8px;
		cursor: pointer;
		&:hover {
			color: ${PrimaryColor};
			background: #f5f5f5;
		}
	}
	.name-file {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
`;

type BoxFileProps = {
	url: string | string[];
	isPrivate?: boolean;
};

const BoxFile = ({ url, isPrivate }: BoxFileProps) => {
	const [visibleFormFile, setVisibleFormFile] = useState(false);
	const [currentFile, setCurrentFile] = useState<string | null>(null);

	const getFileNameExtention = (fileName: string) => fileName?.split('.').pop();

	const renderIconWithFile = (type: string) => {
		switch (type) {
			case 'docx':
			case 'doc':
				return <IconDocument />;
			case 'pdf':
				return <IconFile />;
			case 'xlsx':
				return <IconFile />;
			default:
				return <IconDocument />;
		}
	};

	const urls = Array.isArray(url) ? url : [url];

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
				gap: 12,
			}}
		>
			{urls.map((fileUrl, index) => {
				const fileName = getNameFile(fileUrl);
				return (
					// eslint-disable-next-line react/jsx-key, react/no-array-index-key
					<BoxFileWrapper key={index}>
						<div
							className='box-file item-center shadow'
							onClick={() => {
								setCurrentFile(fileUrl);
								setVisibleFormFile(true);
							}}
						>
							<div style={{ marginRight: 4 }}>{renderIconWithFile(getFileNameExtention(fileName ?? '') ?? '')}</div>
							<div className='name-file'>{fileName}</div>
						</div>
					</BoxFileWrapper>
				);
			})}

			<ModalExpandable
				title='Chi tiết tài liệu'
				width={1000}
				open={visibleFormFile}
				footer={null}
				onCancel={() => {
					setVisibleFormFile(false);
					setCurrentFile(null);
				}}
			>
				{currentFile && <PreviewFile file={currentFile} isPrivate={isPrivate} />}
				<div className='form-footer'>
					<Button
						onClick={() => {
							setVisibleFormFile(false);
							setCurrentFile(null);
						}}
					>
						Đóng
					</Button>
				</div>
			</ModalExpandable>
		</div>
	);
};

export default BoxFile;
