import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import FormKhaiBao from '@/pages/KhaiBaoQuyTrinh/components/FormKhaiBao';
import ViewThongTinChung from '@/pages/KhaiBaoQuyTrinh/components/ViewThongTinChung';
import { ELoaiDanhMucChung } from '@/services/QuyTrinh/DanhMuc/constants';
import { createDonKhaiBaoUser } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';

import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const QuyTrinhPage = () => {
	const { visibleForm, setVisibleForm, setCurrent, setCurrentFormKhaiBao } = useModel('quytrinh.khaibaoquytrinh');
	const {
		getModel: getQuyTrinh,
		setLoading,
		record: recordQuyTrinh,
		setRecord: setRecordQuyTrinh,
	} = useModel('quytrinh.quytrinh');
	const { getAllModel: getDot } = useModel('quytrinh.dotkhaibao');
	const [quyTrinhIdSelect, setQuyTrinhIdSelect] = useState<string>('');
	const [visibleThongTinChung, setVisibleThongTinChung] = useState<boolean>(false);
	const [recordThongTinChung, setRecordThongTinChung] = useState<QuyTrinh.IDanhSachCauHinhThongTinChung[]>([]);
	const { getAllModel: getAllDanhMucChung } = useModel('quytrinh.danhmuc');

	useEffect(() => {
		getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH });
		setCurrentFormKhaiBao(undefined);
		setCurrent(undefined);
	}, []);

	const handleRedirect = async (quyTrinhId: string) => {
		try {
			setLoading(true);
			const res = await getDot(undefined, undefined, { quyTrinhId: quyTrinhId });
			if (res) {
				if (res.length === 1) {
					const res2 = await createDonKhaiBaoUser(quyTrinhId, res?.[0]?._id);
					if (res2) {
						history.push(`/khai-bao-quy-trinh/${res2?.data?.data?._id}?quyTrinh=${quyTrinhId}`);
					}
				} else {
					if (res.length > 1) {
						setQuyTrinhIdSelect(quyTrinhId);
						setVisibleForm(true);
					} else {
						message.warn('Chưa có đợt');
					}
				}
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};
	// const onCellQuyTrinh = (recordVal: QuyTrinh.IRecord) => ({
	// 	onClick: async () => {
	// 		handleRedirect(recordVal?._id??'');
	// 	},
	// 	style: { cursor: 'pointer' },
	// });

	const columns2: IColumn<QuyTrinh.IRecord>[] = [
		{
			title: 'Hoạt động KH&CN',
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
			// onCell: onCellQuyTrinh,
		},
		// {
		// 	title: 'Trả phí',
		// 	dataIndex: ['cauTrucThanhToan', 'yeuCauTraPhi'],
		// 	width: 150,
		// 	align: 'center',
		// 	render: (val) => {
		// 		return (
		// 			<>
		// 				<Checkbox checked={val} />
		// 			</>
		// 		);
		// 	},
		// 	// onCell: onCellQuyTrinh,
		// },
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (recordVal: QuyTrinh.IRecord) => (
				<>
					{recordVal?.danhSachCauHinhThongTinChung && recordVal?.danhSachCauHinhThongTinChung?.length > 0 ? (
						<Tooltip title='Sử dụng dịch vụ'>
							<Button
								onClick={() => {
									setRecordThongTinChung(recordVal?.danhSachCauHinhThongTinChung);
									setRecordQuyTrinh(recordVal);
									setVisibleThongTinChung(true);
								}}
								type='primary'
								// icon={<EyeOutlined />}
							>
								Sử dụng
							</Button>
						</Tooltip>
					) : (
						<Tooltip title='Sử dụng dịch vụ'>
							<Popconfirm
								title='Bạn có muốn sử dụng dich vụ trên?'
								onConfirm={() => {
									handleRedirect(recordVal?._id ?? '');
								}}
								okText='Sử dụng'
								cancelText='Đóng'
							>
								<Button
									type='primary'
									// icon={<EyeOutlined />}
								>
									Sử dụng
								</Button>
							</Popconfirm>
						</Tooltip>
					)}
				</>
			),
		},
	];
	const getDataQuyTrinh = () => {
		getQuyTrinh(undefined, undefined, undefined, undefined, undefined, 'page/CBGV');
	};
	return (
		<>
			<TableBase
				title={'Hoạt động khoa học và công nghệ'}
				buttons={{ create: false, filter: false }}
				modelName={'quytrinh.quytrinh'}
				columns={columns2}
				getData={getDataQuyTrinh}
			/>

			<Modal
				title={'Chọn đợt khai báo'}
				width={500}
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				destroyOnClose
			>
				<FormKhaiBao quyTrinhId={quyTrinhIdSelect} />
			</Modal>
			<Modal
				title={'Thông tin chung'}
				width={1000}
				visible={visibleThongTinChung}
				onCancel={() => setVisibleThongTinChung(false)}
				footer={
					<>
						<Button
							icon={<ArrowRightOutlined />}
							type={'primary'}
							onClick={() => {
								handleRedirect(recordQuyTrinh?._id ?? '');
							}}
						>
							Tiếp theo
						</Button>
					</>
				}
				destroyOnClose
			>
				<ViewThongTinChung dataThongTinChung={recordThongTinChung} />
			</Modal>
		</>
	);
};
export default QuyTrinhPage;
