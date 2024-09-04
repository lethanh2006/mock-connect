import { getNameFile } from '@/utils/utils';
import { FileExcelOutlined, FileOutlined, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons';
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

const BoxFile = (props: { url: string }) => {
	const getFileNameExtention = (fileName: string) => {
		return fileName?.split('.').pop();
	};
	const fileName = getNameFile(props?.url);

	const renderIconWithFile = (type: string) => {
		switch (type) {
			case 'docx':
				return <FileWordOutlined style={{ fontSize: 24 }} />;
				break;
			case 'pdf':
				return <FilePdfOutlined style={{ fontSize: 24 }} />;
				break;
			case 'doc':
				return <FileWordOutlined style={{ fontSize: 24 }} />;
				break;
			case 'xlsx':
				return <FileExcelOutlined style={{ fontSize: 24 }} />;
				break;
			default:
				return <FileOutlined style={{ fontSize: 24 }} />;
				break;
		}
	};

	return (
		<BoxFileWrapper>
			<div
				className='box-file item-center shadow'
				onClick={() => {
					window.open(props?.url);
				}}
			>
				<div style={{ marginRight: 4 }}>{renderIconWithFile(getFileNameExtention(fileName ?? '') ?? '')}</div>
				<div className={'name-file'}>{getNameFile(props?.url)}</div>
			</div>
		</BoxFileWrapper>
	);
};
export default BoxFile;
