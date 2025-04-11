import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';

import {
	EDoiTuongKeHoachNCKH,
	ETrangThaiKeHoachNCKH,
	MapKeyDoiTuongKeHoachNCKH,
} from '@/services/KhoaHoc/KeHoach/constants';
import type { KeHoachNCKH } from '@/services/KhoaHoc/KeHoach/typings';
import { Button, Carousel, Modal, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewDetailKeHoachNCKH from './components/ViewDetail';
import moment from 'moment';
import { primaryColor } from '@/services/base/constant';
import PreviewFile from '@/components/PreviewFile';

const KeHoachNCKHComponent = () => {
	const { getModel, page, limit, setRecord, record: recordKeHoach } = useModel('khoahoc.kehoach');

	const [visibleViewDetail, setVisibleViewDetail] = useState<boolean>(false);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const onCell = (record: KeHoachNCKH.IRecord) => ({
		onClick: () => {
			// setVisibleViewDetail(true);
			setRecord(record);
		},
		style: { cursor: 'pointer' },
	});

	const getData = () => {
		getModel(
			{ doiTuong: EDoiTuongKeHoachNCKH.SINH_VIEN as any, trangThai: ETrangThaiKeHoachNCKH.DUYET },
			undefined,
			undefined,
			undefined,
			undefined,
			'page/duyet',
		);
	};

	const columns: IColumn<KeHoachNCKH.IRecord>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Đối tượng áp dụng',
			dataIndex: 'doiTuong',
			width: 150,
			align: 'center',
			filterType: 'select',
			render: (val: EDoiTuongKeHoachNCKH[]) => val.map((item) => MapKeyDoiTuongKeHoachNCKH[item]).join(', '),
			filterData: Object.values(EDoiTuongKeHoachNCKH).map((item) => ({
				value: item,
				label: MapKeyDoiTuongKeHoachNCKH[item],
			})),
			onCell,
		},
		{
			title: 'Số văn bản',
			dataIndex: 'soQuyetDinh',
			width: 120,
			onCell,
			align: 'center',
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'ngayBanHanh',
			width: 150,
			sortable: true,
			onCell,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'File kèm theo',
			dataIndex: 'fileDinhKem',
			width: 120,
			align: 'center',
			render: (val: string[], rec) =>
				val?.length ? (
					<a
						onClick={() => {
							setRecord(rec);
							setVisibleFormFile(true);
						}}
					>
						<Tag color={primaryColor}>Xem tập tin</Tag>
					</a>
				) : null,
		},
	];

	const handleCancelViewDetail = () => {
		setVisibleViewDetail(false);
		setRecord(undefined);
	};

	return (
		<>
			<TableBase
				buttons={{ create: false }}
				getData={getData}
				columns={columns}
				dependencies={[page, limit]}
				modelName='khoahoc.kehoach'
				title='Kế hoạch NCKH'
			/>
			<Modal
				destroyOnClose
				bodyStyle={{ padding: 0 }}
				width={1200}
				footer={<Button onClick={handleCancelViewDetail}>Đóng</Button>}
				visible={visibleViewDetail}
				onCancel={handleCancelViewDetail}
			>
				{recordKeHoach && <ViewDetailKeHoachNCKH record={recordKeHoach} />}
			</Modal>

			<Modal
				title='Chi tiết tập tin'
				width={800}
				visible={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<Carousel autoplay pauseOnDotsHover>
					{recordKeHoach?.fileDinhKem?.map((item) => (
						// eslint-disable-next-line react/jsx-key
						<PreviewFile file={item ?? ''} />
					))}
				</Carousel>
			</Modal>
		</>
	);
};

export default KeHoachNCKHComponent;
