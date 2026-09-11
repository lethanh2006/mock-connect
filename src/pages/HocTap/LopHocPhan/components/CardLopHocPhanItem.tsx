import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { IconBubbleChat, IconBookOpen, IconCalendar } from '@/components/Icons';
import { Badge, Card, Progress, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useMemo } from 'react';
import { history, useIntl, useModel } from 'umi';
import './style.less';

const { Title, Text } = Typography;

interface CardLopHocPhanItemProps {
	lop: any;
	index: number;
	backgrounds: string[];
	isHienTai?: boolean;
	isKeTiep?: boolean;
	diemDanh?: { soBuoi?: number; coMat?: number; chuaDiemDanh?: number };
	soBaiTap?: number;
	soBaiDang?: number;
}

const CardLopHocPhanItem: React.FC<CardLopHocPhanItemProps> = ({
	lop,
	index,
	backgrounds,
	isHienTai,
	isKeTiep,
	diemDanh,
	soBaiTap,
	soBaiDang,
}) => {
	const intl = useIntl();
	const { setRecord, setVisibleForm } = useModel('daotao.thoikhoabieu');
	// Tạo mảng background cố định cho mỗi item để tránh bị giật hình
	const getBackgroundForItem = (itemId: string, index: number) => {
		const hashNum = Array.from(itemId || `${index}`).reduce((hash, char) => {
			return (hash * 31 + char.charCodeAt(0)) >>> 0;
		}, 0);
		const backgroundIndex = hashNum % backgrounds.length;
		return backgrounds[backgroundIndex];
	};

	let allThoiKhoaBieu = lop.thoiKhoaBieuList ?? [];
	allThoiKhoaBieu = allThoiKhoaBieu.concat(
		lop.children?.flatMap((child: { thoiKhoaBieuList: any }) => child.thoiKhoaBieuList ?? []) ?? [],
	);
	const past = allThoiKhoaBieu.filter((i: { ngay: string | Date }) => dayjs().isAfter(dayjs(i?.ngay))).length;
	const progress = Math.round((past / allThoiKhoaBieu.length) * 100) || 0;

	const isCompleted = progress === 100 || lop?.diem?.diemHpSvHk?.diemKthp;

	const nextClass = useMemo(() => {
		const now = dayjs();
		const upcoming = allThoiKhoaBieu
			.map((tkb: any) => {
				// Ưu tiên thoiGianBatDau(đầy đủ ngày giờ), nếu không có thì dùng ngay(chỉ có ngày, giờ là 00:00)
				const startTime = tkb.thoiGianBatDau ? dayjs(tkb.thoiGianBatDau) : dayjs(tkb.ngay).endOf('day');
				return { ...tkb, startTime, hasTime: !!tkb.thoiGianBatDau };
			})
			.filter((tkb: any) => tkb.startTime.isAfter(now))
			.sort((a: any, b: any) => a.startTime.valueOf() - b.startTime.valueOf());
		return upcoming[0];
	}, [allThoiKhoaBieu]);

	const handleNextClassClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (nextClass) {
			setRecord(nextClass);
			setVisibleForm(true);
			const classId = lop?.parent?._id ?? lop?._id;
			history.push(`/hoc-tap/lop-tin-chi/${classId}#buoi-hoc`);
		}
	};

	return (
		<div className='card-lhp'>
			{isHienTai && (
				<Badge.Ribbon text={intl.formatMessage({ id: 'lophocphan.card.hientai' })} color='green' className='ribbon' />
			)}
			{isKeTiep && !isHienTai && (
				<Badge.Ribbon text={intl.formatMessage({ id: 'lophocphan.card.saptoi' })} color='red' className='ribbon' />
			)}
			<Card
				variant='borderless'
				className='card-lhp-inner'
				style={{
					backgroundImage: `url(${getBackgroundForItem(lop._id, index)})`,
				}}
				onClick={() => history.push(`/hoc-tap/lop-tin-chi/${lop._id}`)}
			>
				{/* <Tag className={`card-lhp-tag ${isCompleted ? 'card-lhp-tag-completed' : 'card-lhp-tag-progressing'}`}>
					{isCompleted ? 'Đã kết thúc' : 'Đang học'}
				</Tag> */}
				{/* <InfoCircleOutlined style={{ color: 'var(--color-primary)', marginLeft: 8 }} /> */}

				<Space wrap style={{ alignItems: 'baseline' }}>
					<Tag
						className='card-lhp-tag card-lhp-tag-completed'
						style={{ display: 'inline-flex', alignItems: 'baseline' }}
					>
						<Text className='card-lhp-malop_copyable'>{lop?.soThuTuLop || lop?.maLop || '--'}</Text>
					</Tag>

					<Text className='color-secondary'>{lop.maHocPhan || '--'}</Text>

					<Text
						className='card-lhp-malop_copyable'
						copyable={{
							text: lop.ten,
							tooltips: [
								intl.formatMessage({ id: 'lophocphan.card.saochep' }),
								intl.formatMessage({ id: 'lophocphan.card.dasaochep' }),
							],
						}}
					/>
				</Space>

				<br />
				<Title level={4} className='card-lhp-title'>
					{lop.hocPhan?.ten}
				</Title>

				{/* <div className='card-lhp-row'> */}
				{/* <span>Mã lớp (nhóm):</span> */}
				{/* <Text strong>{lop.ten}</Text> */}
				{/* </div> */}

				{/* <div className='card-lhp-row'>
					<span>Điểm danh:</span>
					<Text strong>
						{diemDanh?.coMat !== undefined ? diemDanh.coMat : '-'} /{' '}
						{diemDanh?.chuaDiemDanh ? allThoiKhoaBieu.length - (diemDanh?.chuaDiemDanh ?? 0) : '-'}
					</Text>
				</div> */}

				{/* 3 ô thống kê */}
				<div className='card-lhp-row' style={{ marginBottom: 4 }}>
					<Tooltip title={intl.formatMessage({ id: 'lophocphan.card.comat' })}>
						<div
							className='stat'
							onClick={(e) => {
								e.stopPropagation();
								history.push(`/hoc-tap/lop-tin-chi/${lop?._id}#buoi-hoc`);
							}}
						>
							<IconCalendar className='anticon' />
							<Text strong>
								{diemDanh?.coMat !== undefined ? diemDanh.coMat : '-'} /{' '}
								{diemDanh?.chuaDiemDanh
									? diemDanh?.soBuoi || allThoiKhoaBieu.length - (diemDanh?.chuaDiemDanh ?? 0)
									: '-'}
							</Text>
						</div>
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'lophocphan.card.baitap' })}>
						<div
							className='stat'
							onClick={(e) => {
								e.stopPropagation();
								history.push(`/hoc-tap/lop-tin-chi/${lop?._id}#bai-tap`);
							}}
						>
							<IconBookOpen className='anticon' />
							<Text strong>{soBaiTap ?? '--'}</Text>
						</div>
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'lophocphan.card.baidang' })}>
						<div
							className='stat'
							onClick={(e) => {
								e.stopPropagation();
								history.push(`/hoc-tap/lop-tin-chi/${lop?._id}#dien-dan`);
							}}
						>
							<IconBubbleChat className='anticon' />
							<Text strong>{soBaiDang ?? '--'}</Text>
						</div>
					</Tooltip>
				</div>
				<div
					className={`card-lhp-row ${nextClass ? 'hover-highlight' : ''}`}
					onClick={nextClass ? handleNextClassClick : undefined}
					style={{ cursor: nextClass ? 'pointer' : 'default', marginTop: 4, marginBottom: 4 }}
				>
					<span>{intl.formatMessage({ id: 'lophocphan.card.tieptheo' })}:</span>
					<Text strong className={!nextClass ? 'text-secondary' : ''}>
						{nextClass
							? nextClass.hasTime
								? nextClass.startTime.format('HH:mm DD/MM')
								: formatDate(nextClass.startTime)
							: intl.formatMessage({ id: 'lophocphan.card.khongco' })}
					</Text>
				</div>

				{lop?.diem?.diemHpSvHk?.diemKthp ? (
					<div className='card-lhp-row'>
						<span>{intl.formatMessage({ id: 'lophocphan.card.diemthi' })}:</span>
						<Text strong className='text-primary'>
							{lop?.diem?.diemHpSvHk?.diemKthp}
						</Text>
					</div>
				) : (
					<div className='card-lhp-row'>
						<span>{intl.formatMessage({ id: 'lophocphan.card.tientrinh' })}: </span>
						<Text strong>
							{past} / {allThoiKhoaBieu.length}
						</Text>
					</div>
				)}

				<Progress percent={progress} size='small' strokeColor={isCompleted ? '#52c41a' : '#007AFF'} />
			</Card>
		</div>
	);
};

export default CardLopHocPhanItem;
