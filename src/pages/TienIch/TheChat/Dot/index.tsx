import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { TheChat } from '@/services/TienIch/TheChat/typing';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const DotTheChatPage = () => {
	const intl = useIntl();
	const { danhSach, getAllModel, loading, setRecord, record } = useModel('tienich.thechat.dot');

	const getData = () => {
		getAllModel(undefined, undefined, undefined, undefined, 'me/many').then((res) => {
			if (record?._id) {
				setRecord(res?.find((item) => item?._id === record?._id));
			} else {
				setRecord(res[0]);
			}
		});
	};

	useEffect(() => {
		getData();
	}, []);

	const onCell = (rec: TheChat.IDotDanhGiaTheChat) => ({
		onClick: () => {
			setRecord(rec);
		},
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const columns: IColumn<TheChat.IDotDanhGiaTheChat>[] = [
		{
			title: intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.thutu.tablecolumntitle' }),
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.tendot.tablecolumntitle' }),
			dataIndex: 'tenDot',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.thoigianbatdau.tablecolumntitle' }),
			align: 'center',
			width: 120,
			render: (_, rec) => (rec?.thoiGianBatDau ? dayjs(rec.thoiGianBatDau).format('DD/MM/YYYY') : '--'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.thoigianketthuc.tablecolumntitle' }),
			align: 'center',
			width: 120,
			render: (_, rec) => (rec?.thoiGianKetThuc ? dayjs(rec.thoiGianKetThuc).format('DD/MM/YYYY') : '--'),
			onCell,
		},
	];

	return (
		<TableStaticData
			columns={columns}
			data={danhSach ?? []}
			loading={loading}
			size='small'
			otherProps={{ bordered: true, rowKey: (rec: any) => rec.row }}
			hasTotal
		/>
	);
};

export default DotTheChatPage;
