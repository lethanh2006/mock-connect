import ExpandText from '@/components/ExpandText';
import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { primaryColor } from '@/services/base/constant';
import { type EDinhDangBaiThi, mapNameDinhDangBaiThi } from '@/services/KhaoThi/constant';
import type { SinhVienThi } from '@/services/KhaoThi/SinhVienThi/typing';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { getNameFile } from '@/utils/utils';
import { SaveOutlined } from '@ant-design/icons';
import { Card, Segmented, Space, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FilterKyThi from '../../KhaoThi/KyThi/Filter';
import Form from './components/Form';

const BaiThiCuoiKy = () => {
	const intl = useIntl();
	const { record: recordHocKy } = useModel('daotao.hocky');
	const { record: reckyThi } = useModel('khaothi.kythi');
	const { getModel, page, limit, handleEdit } = useModel('khaothi.sinhvienthi');
	const [type, setType] = useState<string>('nopBai');

	const getData = () => {
		if (recordHocKy?._id)
			getModel(
				type === 'nopBai'
					? { kyThiId: reckyThi?._id, yeuCauNopBai: true }
					: { kyThiId: reckyThi?._id, yeuCauRaDe: true },
				undefined,
				undefined,
				undefined,
				undefined,
				`me/hoc-phan-nop-bai/hoc-ky/${recordHocKy?.ma}`,
			);
	};

	const columns: IColumn<SinhVienThi.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'baithi.table.tenHP' }),
			dataIndex: 'tenHocPhan',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.maHP' }),
			align: 'center',
			dataIndex: 'maHocPhan',
			width: 90,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.deBai' }),
			dataIndex: 'fileDinhKem',
			width: 300,
			render: (val, rec) =>
				rec?.fileDinhKem?.length
					? rec?.fileDinhKem?.map((item: any) => (
						<div key={item} style={{ maxWidth: 300 }}>
							-{' '}
							<a href={item} target='_blank' rel='noreferrer'>
								{getNameFile(item)}
							</a>
						</div>
					))
					: null,
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.tgBatDau' }),
			align: 'center',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			render: (val, rec) => val && formatDateTime(val),
			filterType: 'date',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.tgKetThuc' }),
			align: 'center',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			render: (val, rec) => val && formatDateTime(val),
			filterType: 'date',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.slFile' }),
			align: 'center',
			dataIndex: 'soFilePhaiNop',
			width: 130,
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.dungLuong' }),
			align: 'center',
			dataIndex: 'dungLuongToiDa',
			render: (val, rec) => val && `${val} MB`,
			width: 130,
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.dinhDang' }),
			dataIndex: 'dinhDangFileChoPhep',
			width: 200,
			render: (val: EDinhDangBaiThi[], rec) =>
				val?.length && (
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
						{val?.map((item) => <Tag key={item}>{mapNameDinhDangBaiThi[item]}</Tag>)}
					</div>
				),
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.baiTap' }),
			dataIndex: 'daNopBai',
			width: 150,
			render: (val, rec) =>
				!val ? (
					<div style={{ textAlign: 'center' }}>
						<Tag color='red'>{intl.formatMessage({ id: 'baithi.table.chuaNop' })}</Tag>
					</div>
				) : (
					rec?.urlBaiNop?.map((item: any) => (
						<div key={item} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
							-{' '}
							<a href={item} target='_blank' rel='noreferrer'>
								{getNameFile(item)}
							</a>
						</div>
					))
				),
			hide: type === 'raDe',
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.ghiChu' }),
			dataIndex: 'ghiChuKhac',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'baithi.table.thaoTac' }),
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (val, rec) => {
				const ngoaiThoiGian =
					rec?.choPhepNopNgoaiThoiGian !== true &&
					(!rec?.thoiGianBatDau ||
						!rec?.thoiGianKetThuc ||
						dayjs().isBefore(dayjs(rec?.thoiGianBatDau)) ||
						dayjs().isAfter(dayjs(rec?.thoiGianKetThuc)));

				return (
					<ButtonExtend
						disabled={ngoaiThoiGian || !!rec?.daNopBai}
						tooltip={
							!!rec?.daNopBai
								? intl.formatMessage({ id: 'baithi.table.daNop' })
								: ngoaiThoiGian
									? intl.formatMessage({ id: 'baithi.table.ngoaiTG' })
									: intl.formatMessage({ id: 'baithi.table.nopBaiTap' })
						}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<SaveOutlined />}
					/>
				);
			},
			hide: type === 'raDe',
		},
	];

	return (
		<PageCard
			title={
				<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
					<span>{intl.formatMessage({ id: 'baithi.title' })}</span>
					<FilterKyThi />
				</Space>
			}
		>
			<Card variant='borderless'>
				<TableBase
					getData={getData}
					buttons={{
						create: false,
					}}
					columns={columns}
					dependencies={[page, limit, reckyThi?._id, recordHocKy?.ma, type]}
					modelName='khaothi.sinhvienthi'
					hideCard
					Form={Form}
					formProps={{ getData }}
					destroyModal
					otherButtons={[
						<Space key={'1'} wrap>
							<Segmented
								value={type}
								onChange={(val) => {
									setType(val as string);
								}}
								options={[
									{ value: 'nopBai', label: intl.formatMessage({ id: 'baithi.label.giaoDeNopBai' }) },
									{ value: 'raDe', label: intl.formatMessage({ id: 'baithi.label.giaoDe' }) },
								]}
							/>
							{type === 'raDe' && (
								<div style={{ fontStyle: 'italic', color: primaryColor }}>
									{intl.formatMessage(
										{ id: 'baithi.msg.raDeNote' },
										{
											strong: (chunks) => <strong>{chunks}</strong>,
										},
									)}
								</div>
							)}
						</Space>,
					]}
				/>
			</Card>
		</PageCard>
	);
};

export default BaiThiCuoiKy;
