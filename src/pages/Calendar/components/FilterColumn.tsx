import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Calendar as AntdCalendar, Checkbox, Col, Popover, Row, Select } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useModel } from 'umi';
import PickColorLich from './PickColorLich';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EditFilled } from '@ant-design/icons';
import { useState } from 'react';

const FilterColumn = (props: { date: Date; setDate: (val: Date) => void }) => {
	const { date, setDate } = props;
	const { selectSuKiens, setSelectSuKiens, setDataCalendar, dataLich } = useModel('sukien');
	const { record: recSetting } = useModel('settinglich');
	const [hovered, setHovered] = useState<ELoaiSuKien | null>(null);

	const pickDate = (val: moment.Moment) => setDate(val.toDate());

	const changeLoaiSuKien = (checkedValue: any) => {
		setSelectSuKiens(checkedValue as ELoaiSuKien[]);
		const filteredEvents = dataLich.filter((event) => checkedValue.includes(event.loaiSuKien));
		setDataCalendar(filteredEvents);
	};

	return (
		<div>
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
				value={moment(date)}
			/>

			<Checkbox.Group value={selectSuKiens} onChange={changeLoaiSuKien}>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.CHUNG)}
					// onMouseLeave={() => setHovered(null)}
					style={{ display: 'flex', alignItems: 'center' }}
				>
					<Checkbox value={ELoaiSuKien.CHUNG}>
						<p
							style={{
								backgroundColor:
									recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.CHUNG)?.maMau ??
									ColorSuKien[ELoaiSuKien.CHUNG],
								color: 'white',
								padding: '2px 6px',
								borderRadius: 2,
							}}
						>
							Sự kiện chung
						</p>
					</Checkbox>
					{hovered === ELoaiSuKien.CHUNG && (
						<Popover content={<PickColorLich loaiLich={ELoaiSuKien.CHUNG} />} trigger='click' placement='right'>
							<ButtonExtend type='link' icon={<EditFilled />} style={{ marginTop: -10 }} />
						</Popover>
					)}
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.LICH_HOC)}
					// onMouseLeave={() => setHovered(null)}
					style={{ display: 'flex', alignItems: 'center' }}
				>
					<Checkbox value={ELoaiSuKien.LICH_HOC}>
						<p
							style={{
								backgroundColor:
									recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.LICH_HOC)?.maMau ??
									ColorSuKien[ELoaiSuKien.LICH_HOC],
								color: 'white',
								padding: '2px 6px',
								borderRadius: 2,
							}}
						>
							{ELoaiSuKien.LICH_HOC}
						</p>
					</Checkbox>
					{hovered === ELoaiSuKien.LICH_HOC && (
						<Popover content={<PickColorLich loaiLich={ELoaiSuKien.LICH_HOC} />} trigger='click' placement='right'>
							<ButtonExtend type='link' icon={<EditFilled />} style={{ marginTop: -10 }} />
						</Popover>
					)}
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.BAI_TAP)}
					// onMouseLeave={() => setHovered(null)}
					style={{ display: 'flex', alignItems: 'center' }}
				>
					<Checkbox value={ELoaiSuKien.BAI_TAP}>
						<p
							style={{
								backgroundColor:
									recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.BAI_TAP)?.maMau ??
									ColorSuKien[ELoaiSuKien.BAI_TAP],
								color: 'white',
								padding: '2px 6px',
								borderRadius: 2,
							}}
						>
							Bài tập
						</p>
					</Checkbox>
					{hovered === ELoaiSuKien.BAI_TAP && (
						<Popover content={<PickColorLich loaiLich={ELoaiSuKien.BAI_TAP} />} trigger='click' placement='right'>
							<ButtonExtend type='link' icon={<EditFilled />} style={{ marginTop: -10 }} />
						</Popover>
					)}
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.LICH_THI)}
					// onMouseLeave={() => setHovered(null)}
					style={{ display: 'flex', alignItems: 'center' }}
				>
					<Checkbox value={ELoaiSuKien.LICH_THI}>
						<p
							style={{
								backgroundColor:
									recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.LICH_THI)?.maMau ??
									ColorSuKien[ELoaiSuKien.LICH_THI],
								color: 'white',
								padding: '2px 6px',
								borderRadius: 2,
							}}
						>
							{ELoaiSuKien.LICH_THI}
						</p>
					</Checkbox>
					{hovered === ELoaiSuKien.LICH_THI && (
						<Popover content={<PickColorLich loaiLich={ELoaiSuKien.LICH_THI} />} trigger='click' placement='right'>
							<ButtonExtend type='link' icon={<EditFilled />} style={{ marginTop: -10 }} />
						</Popover>
					)}
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.HOP_LOP)}
					// onMouseLeave={() => setHovered(null)}
					style={{ display: 'flex', alignItems: 'center' }}
				>
					<Checkbox value={ELoaiSuKien.HOP_LOP}>
						<p
							style={{
								backgroundColor:
									recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.HOP_LOP)?.maMau ??
									ColorSuKien[ELoaiSuKien.HOP_LOP],
								color: 'white',
								padding: '2px 6px',
								borderRadius: 2,
							}}
						>
							Họp lớp
						</p>
					</Checkbox>
					{hovered === ELoaiSuKien.HOP_LOP && (
						<Popover content={<PickColorLich loaiLich={ELoaiSuKien.HOP_LOP} />} trigger='click' placement='right'>
							<ButtonExtend type='link' icon={<EditFilled />} style={{ marginTop: -10 }} />
						</Popover>
					)}
				</div>
				<div
					onMouseEnter={() => setHovered(ELoaiSuKien.CA_NHAN)}
					// onMouseLeave={() => setHovered(null)}
					style={{ display: 'flex', alignItems: 'center' }}
				>
					<Checkbox value={ELoaiSuKien.CA_NHAN}>
						<p
							style={{
								backgroundColor:
									recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.CA_NHAN)?.maMau ??
									ColorSuKien[ELoaiSuKien.CA_NHAN],
								color: 'white',
								padding: '2px 6px',
								borderRadius: 2,
							}}
						>
							Sự kiện cá nhân
						</p>
					</Checkbox>
					{hovered === ELoaiSuKien.CA_NHAN && (
						<Popover content={<PickColorLich loaiLich={ELoaiSuKien.CA_NHAN} />} trigger='click' placement='right'>
							<ButtonExtend type='link' icon={<EditFilled />} style={{ marginTop: -10 }} />
						</Popover>
					)}
				</div>
			</Checkbox.Group>
		</div>
	);
};

export default FilterColumn;
