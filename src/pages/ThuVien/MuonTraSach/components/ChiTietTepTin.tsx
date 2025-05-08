import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const ChiTietTepTin = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { record } = useModel('thuvien.anpham');

	const [currentIndex, setCurrentIndex] = useState(0);
	const files = record?.thongTinAnPhamTrucTuyen || [];

	const nextSlide = () => {
		setCurrentIndex((prev) => (prev + 1) % files.length);
	};

	const prevSlide = () => {
		setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
	};

	return (
		<ModalExpandable
			title='Chi tiết tập tin'
			visible={visible}
			onCancel={() => setVisible(false)}
			width={1000}
			footer={null}
		>
			<Space wrap>
				<Button onClick={prevSlide}>
					<LeftOutlined />
				</Button>
				<span>
					Tệp tin {files.length > 0 ? currentIndex + 1 : 0}/{files.length}
				</span>
				<Button onClick={nextSlide}>
					<RightOutlined />
				</Button>
			</Space>

			<div style={{ marginTop: 12 }}>
				<PreviewFile file={files[currentIndex]?.url ?? ''} />
			</div>
		</ModalExpandable>
	);
};

export default ChiTietTepTin;
