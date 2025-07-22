import ButtonExtend from '@/components/Table/ButtonExtend';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { CalendarOutlined, DownOutlined, EditFilled } from '@ant-design/icons';
import { Calendar as AntdCalendar, Button, Checkbox, Col, Popover, Row, Select } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import PickColorLich from './PickColorLich';

const FilterColumn = (props: { date: Date; setDate: (val: Date) => void }) => {
	const { date, setDate } = props;
	const { selectSuKiens, setSelectSuKiens, setDataCalendar, dataLich } = useModel('sukien.sukien');
	const { record: recSetting } = useModel('tienich.settinglich');
	const [hovered, setHovered] = useState<ELoaiSuKien | null>(null);
	const [expandMiniCalendar, setExpandMiniCalendar] = useState(false);

	const pickDate = (val: moment.Moment) => setDate(val.toDate());

	const changeLoaiSuKien = (checkedValue: any) => {
		setSelectSuKiens(checkedValue as ELoaiSuKien[]);
		const filteredEvents = dataLich.filter((event) => checkedValue.includes(event.loaiSuKien));
		setDataCalendar(filteredEvents);
	};

	return (
		<div>
			<Button
				style={{
					width: '100%',
					height: '40px',
					border: '1px solid #d9d9d9',
					borderTop: 'none',
					// borderRadius: 0,
					borderBottomLeftRadius: '6px',
					borderBottomRightRadius: '6px',
					borderTopLeftRadius: '0px',
					borderTopRightRadius: '0px',
					background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					position: 'relative',
					overflow: 'hidden',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingLeft: '16px',
					paddingRight: '16px',
					fontSize: '14px',
					fontWeight: '500',
					color: '#262626',
					...(hovered && {
						background: 'linear-gradient(135deg, #f0f0f0 0%, #e6e6e6 100%)',
						borderColor: '#40a9ff',
						boxShadow: '0 2px 8px rgba(64, 169, 255, 0.15)',
						transform: 'translateY(-1px)',
					}),
				}}
				onClick={() => setExpandMiniCalendar(!expandMiniCalendar)}
			>
				<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<CalendarOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
				</span>
				<div>{moment(date).format('DD/MM/YYYY')}</div>
				<DownOutlined
					style={{
						fontSize: '12px',
						transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						transform: expandMiniCalendar ? 'rotate(180deg)' : 'rotate(0deg)',
					}}
				/>
			</Button>

			<div
				style={{
					overflow: 'hidden',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					background: 'white',
					borderRadius: '6px',
					boxShadow: expandMiniCalendar ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
					border: expandMiniCalendar ? '1px solid #e8e8e8' : 'none',
					maxHeight: expandMiniCalendar ? '500px' : '0',
					opacity: expandMiniCalendar ? '1' : '0',
					marginTop: expandMiniCalendar ? '8px' : '0',
					padding: expandMiniCalendar ? '16px' : '0',
				}}
			>
				{expandMiniCalendar && (
					<AntdCalendar
						headerRender={({ value, onChange }) => (
							<div style={{ marginTop: 12, marginBottom: 8 }}>
								<Row gutter={8}>
									<Col span={12}>
										<Select
											style={{ width: '100%' }}
											size='small'
											onChange={(newYear: any) => {
												const now = value.clone().year(newYear);
												onChange(now);
											}}
											value={value.year()}
											options={_.range(2020, moment().year() + 1).map((y) => ({
												key: y,
												value: y,
												label: y,
											}))}
										/>
									</Col>
									<Col span={12}>
										<Select
											style={{ width: '100%' }}
											size='small'
											value={value.month()}
											onChange={(selectedMonth) => {
												const newValue = value.clone();
												newValue.month(selectedMonth);
												onChange(newValue);
											}}
											options={_.range(0, 12).map((m) => ({
												key: m,
												value: m,
												label: `Tháng ${m + 1}`,
											}))}
										/>
									</Col>
								</Row>
							</div>
						)}
						onChange={(val: any) => pickDate(val)}
						fullscreen={false}
						mode={'month'}
						value={dayjs(date)}
					/>
				)}
			</div>

			<Checkbox.Group
				value={selectSuKiens}
				onChange={changeLoaiSuKien}
				style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}
			>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.CHUNG)}
					style={{
						display: 'flex',
						alignItems: 'center',
						userSelect: 'none',
						width: '100%',
					}}
				>
					<Checkbox value={ELoaiSuKien.CHUNG} style={{ flexShrink: 0 }} />
					<div
						style={{
							backgroundColor:
								recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.CHUNG)?.maMau ??
								ColorSuKien[ELoaiSuKien.CHUNG],
							color: 'white',
							padding: '6px 12px',
							borderRadius: 4,
							marginLeft: 8,
							flex: 1,
							textAlign: 'left',
							paddingLeft: '16px',
							position: 'relative',
						}}
					>
						Sự kiện chung
						{hovered === ELoaiSuKien.CHUNG && (
							<Popover content={<PickColorLich loaiLich={ELoaiSuKien.CHUNG} />} trigger='click' placement='right'>
								<ButtonExtend
									type='link'
									icon={<EditFilled />}
									style={{
										position: 'absolute',
										right: 4,
										top: '50%',
										transform: 'translateY(-50%)',
										color: 'white',
										padding: 0,
										height: 'auto',
										minWidth: 'auto',
									}}
								/>
							</Popover>
						)}
					</div>
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.LICH_HOC)}
					style={{
						display: 'flex',
						alignItems: 'center',
						userSelect: 'none',
						width: '100%',
					}}
				>
					<Checkbox value={ELoaiSuKien.LICH_HOC} style={{ flexShrink: 0 }} />
					<div
						style={{
							backgroundColor:
								recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.LICH_HOC)?.maMau ??
								ColorSuKien[ELoaiSuKien.LICH_HOC],
							color: 'white',
							padding: '6px 12px',
							borderRadius: 4,
							marginLeft: 8,
							flex: 1,
							textAlign: 'left',
							paddingLeft: '16px',
							position: 'relative',
						}}
					>
						Lịch học
						{hovered === ELoaiSuKien.LICH_HOC && (
							<Popover content={<PickColorLich loaiLich={ELoaiSuKien.LICH_HOC} />} trigger='click' placement='right'>
								<ButtonExtend
									type='link'
									icon={<EditFilled />}
									style={{
										position: 'absolute',
										right: 4,
										top: '50%',
										transform: 'translateY(-50%)',
										color: 'white',
										padding: 0,
										height: 'auto',
										minWidth: 'auto',
									}}
								/>
							</Popover>
						)}
					</div>
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.BAI_TAP)}
					style={{
						display: 'flex',
						alignItems: 'center',
						userSelect: 'none',
						width: '100%',
					}}
				>
					<Checkbox value={ELoaiSuKien.BAI_TAP} style={{ flexShrink: 0 }} />
					<div
						style={{
							backgroundColor:
								recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.BAI_TAP)?.maMau ??
								ColorSuKien[ELoaiSuKien.BAI_TAP],
							color: 'white',
							padding: '6px 12px',
							borderRadius: 4,
							marginLeft: 8,
							flex: 1,
							textAlign: 'left',
							paddingLeft: '16px',
							position: 'relative',
						}}
					>
						Bài tập
						{hovered === ELoaiSuKien.BAI_TAP && (
							<Popover content={<PickColorLich loaiLich={ELoaiSuKien.BAI_TAP} />} trigger='click' placement='right'>
								<ButtonExtend
									type='link'
									icon={<EditFilled />}
									style={{
										position: 'absolute',
										right: 4,
										top: '50%',
										transform: 'translateY(-50%)',
										color: 'white',
										padding: 0,
										height: 'auto',
										minWidth: 'auto',
									}}
								/>
							</Popover>
						)}
					</div>
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.LICH_THI)}
					style={{
						display: 'flex',
						alignItems: 'center',
						userSelect: 'none',
						width: '100%',
					}}
				>
					<Checkbox value={ELoaiSuKien.LICH_THI} style={{ flexShrink: 0 }} />
					<div
						style={{
							backgroundColor:
								recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.LICH_THI)?.maMau ??
								ColorSuKien[ELoaiSuKien.LICH_THI],
							color: 'white',
							padding: '6px 12px',
							borderRadius: 4,
							marginLeft: 8,
							flex: 1,
							textAlign: 'left',
							paddingLeft: '16px',
							position: 'relative',
						}}
					>
						Lịch thi
						{hovered === ELoaiSuKien.LICH_THI && (
							<Popover content={<PickColorLich loaiLich={ELoaiSuKien.LICH_THI} />} trigger='click' placement='right'>
								<ButtonExtend
									type='link'
									icon={<EditFilled />}
									style={{
										position: 'absolute',
										right: 4,
										top: '50%',
										transform: 'translateY(-50%)',
										color: 'white',
										padding: 0,
										height: 'auto',
										minWidth: 'auto',
									}}
								/>
							</Popover>
						)}
					</div>
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.HOP_LOP)}
					style={{
						display: 'flex',
						alignItems: 'center',
						userSelect: 'none',
						width: '100%',
					}}
				>
					<Checkbox value={ELoaiSuKien.HOP_LOP} style={{ flexShrink: 0 }} />
					<div
						style={{
							backgroundColor:
								recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.HOP_LOP)?.maMau ??
								ColorSuKien[ELoaiSuKien.HOP_LOP],
							color: 'white',
							padding: '6px 12px',
							borderRadius: 4,
							marginLeft: 8,
							flex: 1,
							textAlign: 'left',
							paddingLeft: '16px',
							position: 'relative',
						}}
					>
						Họp lớp
						{hovered === ELoaiSuKien.HOP_LOP && (
							<Popover content={<PickColorLich loaiLich={ELoaiSuKien.HOP_LOP} />} trigger='click' placement='right'>
								<ButtonExtend
									type='link'
									icon={<EditFilled />}
									style={{
										position: 'absolute',
										right: 4,
										top: '50%',
										transform: 'translateY(-50%)',
										color: 'white',
										padding: 0,
										height: 'auto',
										minWidth: 'auto',
									}}
								/>
							</Popover>
						)}
					</div>
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.CA_NHAN)}
					style={{
						display: 'flex',
						alignItems: 'center',
						userSelect: 'none',
						width: '100%',
					}}
				>
					<Checkbox value={ELoaiSuKien.CA_NHAN} style={{ flexShrink: 0 }} />
					<div
						style={{
							backgroundColor:
								recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.CA_NHAN)?.maMau ??
								ColorSuKien[ELoaiSuKien.CA_NHAN],
							color: 'white',
							padding: '6px 12px',
							borderRadius: 4,
							marginLeft: 8,
							flex: 1,
							textAlign: 'left',
							paddingLeft: '16px',
							position: 'relative',
						}}
					>
						Sự kiện cá nhân
						{hovered === ELoaiSuKien.CA_NHAN && (
							<Popover content={<PickColorLich loaiLich={ELoaiSuKien.CA_NHAN} />} trigger='click' placement='right'>
								<ButtonExtend
									type='link'
									icon={<EditFilled />}
									style={{
										position: 'absolute',
										right: 4,
										top: '50%',
										transform: 'translateY(-50%)',
										color: 'white',
										padding: 0,
										height: 'auto',
										minWidth: 'auto',
									}}
								/>
							</Popover>
						)}
					</div>
				</div>
			</Checkbox.Group>
		</div>
	);
};

export default FilterColumn;
