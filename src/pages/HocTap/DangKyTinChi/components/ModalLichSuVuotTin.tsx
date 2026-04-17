import TableBase from '@/components/Table';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { IColumn } from '@/components/Table/typing';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormVuotTin from './FormVuotTin';

import { TrangThaiDonDangKyHocVuot, trangThaiDonDangKyHocVuotColor } from '@/services/DaoTao/DkVuotTinChi/constant';
import { type DkVuotTinChi } from '@/services/DaoTao/DkVuotTinChi/typing';

interface Props {
	visible: boolean;
	onClose: () => void;
}

const ModalLichSuVuotTin: React.FC<Props> = ({ visible, onClose }) => {
	const intl = useIntl();
	const { getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');
	const { danhSach, handleEdit, setRecord, setEdit, setIsView, setVisibleForm, getModel } =
		useModel('daotao.dkvuottinchi');

	useEffect(() => {
		getThongTinCuaToiModel();
	}, []);

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');
	};

	const onCreate = () => {
		setRecord?.({} as DkVuotTinChi.IRecord);
		setEdit?.(false);
		setIsView?.(false);
		setVisibleForm?.(true);
	};

	const columns: IColumn<DkVuotTinChi.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.vuottin.modal.col.hocky' }),
			dataIndex: 'hocKy',
			width: 150,
			render(value) {
				return value?.ten;
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.vuottin.form.label.stctoithieuhientai' }),
			dataIndex: 'soTinChiToiThieu',
			width: 150,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.vuottin.form.label.stctoidahientai' }),
			dataIndex: 'soTinChiToiDa',
			width: 150,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.vuottin.form.label.stctoidadangky' }),
			dataIndex: 'soTinChiToiDaDangKy',
			width: 150,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.trangthai' }),
			dataIndex: 'trangThai',
			width: 150,
			align: 'center',
			filterType: 'select',
			render: (val: TrangThaiDonDangKyHocVuot) => (
				<Tag color={trangThaiDonDangKyHocVuotColor[val]}>
					{intl.formatMessage({ id: `dangkytinchi.vuottin.status.text.${val}` })}
				</Tag>
			),
			filterData: Object.values(TrangThaiDonDangKyHocVuot).map((item) => ({
				value: item,
				label: intl.formatMessage({ id: `dangkytinchi.vuottin.status.text.${item}` }),
			})),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.vuottin.modal.col.nguoixuly' }),
			dataIndex: 'thongTinNhanSuDuyet',
			width: 150,
			render(value) {
				return value;
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.vuottin.modal.col.ghichu' }),
			dataIndex: 'ghiChuNguoiDuyet',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'pages.hoctap.lichthi.thoigian' }),
			dataIndex: 'createdAt',
			width: 150,
			render: (val) => dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.vuottin.modal.col.tacdong' }),
			dataIndex: 'index',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (text, record) =>
				record?.trangThai !== TrangThaiDonDangKyHocVuot.DA_DUYET ? (
					<Button icon={<EditOutlined />} type='link' onClick={() => handleEdit(record)} />
				) : null,
		},
	];

	return (
		<ModalExpandable
			title={intl.formatMessage({ id: 'dangkytinchi.vuottin.modal.title' })}
			visible={visible}
			onCancel={onClose}
			width={1200}
			footer={null}
		>
			<TableBase
				modelName='daotao.dkvuottinchi'
				columns={columns}
				getData={getData}
				hideCard
				buttons={{
					create: false,
					reload: true,
				}}
				otherButtons={
					danhSach?.[0]?.trangThai !== TrangThaiDonDangKyHocVuot.DA_DUYET
						? [
								<Button key='register' type='primary' onClick={onCreate}>
									{intl.formatMessage({ id: 'dangkytinchi.vuottin.button.dangkyvuottin' })}
								</Button>,
							]
						: []
				}
				Form={FormVuotTin}
				showModalTitle
				modalTitle={intl.formatMessage({ id: 'dangkytinchi.vuottin.button.dangkyvuottin' })}
			/>
			<div className='form-footer'>
				<Button key='close' onClick={onClose}>
					{intl.formatMessage({ id: 'dangkytinchi.action.dong' })}
				</Button>
			</div>
		</ModalExpandable>
	);
};

export default ModalLichSuVuotTin;
