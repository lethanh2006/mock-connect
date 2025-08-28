import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { getNameFile } from '@/utils/utils';
import { FileExcelOutlined, FileOutlined, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

const PrimaryColor = APP_CONFIG_PRIMARY_COLOR;

const BoxFileWrapper = styled.div`
	.list-file {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.box-file {
		flex: 1 1 auto;
		min-width: 140px;
		max-width: 240px;
		display: flex;
		align-items: center;
		padding: 8px;
		border: 1px solid #f0f0f0;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			border-color: ${PrimaryColor};
			background: #f5f5f5;
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
			color: ${PrimaryColor};
		}
	}

	.icon {
		flex-shrink: 0;
		font-size: 24px;
		margin-right: 8px;
		color: #666;
	}

	.name-file {
		flex: 1;
		font-size: 14px;
		color: #333;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		word-break: break-word;
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
		<BoxFileWrapper>
			<div className='list-file' onClick={() => setVisibleFormFile(true)}>
				{urls.map((fileUrl) => {
					const fileName = getNameFile(fileUrl);
					return (
						<div key={fileUrl} className='box-file shadow'>
							<div className='icon'>{renderIconWithFile(getFileNameExtention(fileName ?? '') ?? '')}</div>
							<div className='name-file'>{fileName}</div>
						</div>
					);
				})}
			</div>

			<ModalExpandable
				centered
				title='Chi tiết tài liệu'
				width={1000}
				visible={visibleFormFile}
				footer={null}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={urls} />
				<div className='form-footer'>
					<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
				</div>
			</ModalExpandable>
		</BoxFileWrapper>
	);
};

export default BoxFile;
