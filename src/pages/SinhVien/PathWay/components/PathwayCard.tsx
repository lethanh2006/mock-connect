import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Button, Card, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';

interface PathwayCardProps {
	pathway: ChuongTrinhDaoTao.IKhoiKienThuc | null;
	onSuccess?: () => void;
}

const PathwayCard = ({ pathway, onSuccess }: PathwayCardProps) => {
	const intl = useIntl();
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');
	const { currentKhoiLuaChonMa, handleSelectPathway, formSubmiting, registeredPathway } = useModel('sinhvien.pathway');
	const [visibleDeCuong, setVisibleDeCuong] = useState(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);

	const isChosen = pathway ? registeredPathway?.maKhoiKienThuc === pathway.ma : false;
	const hasRegisteredPathway = !!registeredPathway?.maKhoiKienThuc;

	if (!pathway) {
		return (
			<Card>
				<div style={{ textAlign: 'center', padding: 40 }}>
					{intl.formatMessage({ id: 'pathway.empty.selectPathway' })}
				</div>
			</Card>
		);
	}

	// Transform data để hỗ trợ sort và search
	const transformedData = (pathway.khoiHpCtList || []).map((item) => ({
		...item,
		maHocPhan: item.hocPhan?.ma || '-',
		tenHocPhan: item.hocPhan?.ten || item.ten || '-',
		soTinChi: item.hocPhan?.soTinChi || item.soTinChiTuChonPhaiHoc || 0,
		soThuTuKy: item.soThuTuKy ?? 0,
	}));

	// Sort mặc định theo học kỳ
	const sortedData = [...transformedData].sort((a, b) => {
		return a.soThuTuKy - b.soThuTuKy;
	});

	const totalCredits = sortedData.reduce((sum, item) => {
		return sum + item.soTinChi;
	}, 0);

	const handleChoosePathway = async () => {
		if (!handleSelectPathway || !maKhoaNganh || !currentKhoiLuaChonMa || !pathway.ma) {
			return;
		}

		await handleSelectPathway(
			{
				maKhoaNganh,
				maKhoiCha: currentKhoiLuaChonMa,
				maKhoiCon: pathway.ma,
			},
			{
				errorIncomplete: intl.formatMessage({ id: 'pathway.error.incomplete' }),
				successChoose: intl.formatMessage({ id: 'pathway.success.choose' }),
				errorChoose: intl.formatMessage({ id: 'pathway.error.choose' }),
			},
			onSuccess,
		);
	};

	const handleXemDeCuong = (record: (typeof sortedData)[0]) => {
		const deCuongId = record.hocPhan?.ma ?? '';
		if (!deCuongId) return;
		setDeCuongModal({
			deCuongId,
			title: `${intl.formatMessage({ id: 'lophocphan.id.decuong.title' })} - ${
				record.hocPhan?.ten || record.maHocPhan || ''
			}`,
		});
		setVisibleDeCuong(true);
	};

	const columns: IColumn<(typeof sortedData)[0]>[] = [
		{
			title: intl.formatMessage({ id: 'pathway.table.code' }),
			width: 120,
			dataIndex: 'maHocPhan',
			sortable: true,
			filterType: 'string',
			render: (_: any, record: (typeof sortedData)[0]) => {
				const code = record.maHocPhan || '-';
				return (
					<a
						onClick={(e) => {
							e.stopPropagation();
							handleXemDeCuong(record);
						}}
					>
						{code}
					</a>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.courseTitle' }),
			width: 180,
			dataIndex: 'tenHocPhan',
			sortable: true,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.sem' }),
			width: 100,
			align: 'center',
			dataIndex: 'soThuTuKy',
			sortable: true,
			render: (_: any, record: (typeof sortedData)[0]) =>
				intl.formatMessage({ id: 'pathway.table.semFormat' }, { sem: record.soThuTuKy }),
		},
		{
			title: intl.formatMessage({ id: 'pathway.table.credits' }),
			width: 100,
			align: 'center',
			dataIndex: 'soTinChi',
			sortable: true,
			render: (_: any, record: (typeof sortedData)[0]) => {
				const credits = record.soTinChi;
				const tagColor = credits === 0 ? 'default' : credits === 1 || credits === 2 ? 'gold' : 'red';
				return (
					<Tag color={tagColor}>
						{credits} {intl.formatMessage({ id: 'pathway.table.credits' })}
					</Tag>
				);
			},
		},
	];

	return (
		<Card
			title={pathway?.ten}
			extra={
				<Tag color='blue'>
					{totalCredits} {intl.formatMessage({ id: 'pathway.card.credits' })}
				</Tag>
			}
		>
			<TableStaticData columns={columns} data={sortedData} addStt hasTotal otherProps={{ pagination: false }} />

			{!hasRegisteredPathway && !isChosen && (
				<div className='form-footer'>
					<Button type='primary' loading={formSubmiting} onClick={handleChoosePathway}>
						{intl.formatMessage({ id: 'pathway.button.choose' })}
					</Button>
				</div>
			)}
			{deCuongModal && (
				<ModalHocPhan
					visible={visibleDeCuong}
					setVisible={setVisibleDeCuong}
					deCuongId={deCuongModal.deCuongId}
					title={deCuongModal.title}
				/>
			)}
		</Card>
	);
};

export default PathwayCard;
