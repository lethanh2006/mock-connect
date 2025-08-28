import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { getNameFile } from '@/utils/utils';
import { FileExcelOutlined, FileOutlined, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons';
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
};

const BoxFile = ({ url }: BoxFileProps) => {
	const [visibleFormFile, setVisibleFormFile] = useState(false);

	const getFileNameExtention = (fileName: string) => fileName?.split('.').pop();

	const renderIconWithFile = (type: string) => {
		switch (type) {
			case 'docx':
			case 'doc':
				return <FileWordOutlined />;
			case 'pdf':
				return <FilePdfOutlined />;
			case 'xlsx':
				return <FileExcelOutlined />;
			default:
				return <FileOutlined />;
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
			{urls.map((fileUrl) => {
				const fileName = getNameFile(fileUrl);
				return (
					// eslint-disable-next-line react/jsx-key
					<BoxFileWrapper>
						<div className='box-file item-center shadow' onClick={() => setVisibleFormFile(true)}>
							<div style={{ marginRight: 4 }}>{renderIconWithFile(getFileNameExtention(fileName ?? '') ?? '')}</div>
							<div className='name-file'>{fileName}</div>
						</div>
					</BoxFileWrapper>
				);
			})}

			<ModalExpandable
				centered
				title='Chi tiết tài liệu'
				width={1000}
				open={visibleFormFile}
				footer={null}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={urls} />
				<div className='form-footer'>
					<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
				</div>
			</ModalExpandable>
		</div>
	);
};

export default BoxFile;
