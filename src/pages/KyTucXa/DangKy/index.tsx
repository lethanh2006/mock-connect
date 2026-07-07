import PageCard from '@/components/PageCard';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Empty, Flex, Input, Pagination, Row, Select, Space, Spin } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import SelectDanhMucChungKTX from '../DanhMucChung/Select';
import SelectToaNhaKTX from '../ToaNha/Select';
import CardPhong from './components/CardPhong';
import ChiTietPhong from './components/ChiTiet';
import ModalDanKyKTX from './components/Modal';
import './style.less';
import { EOperatorType } from '@/components/Table/constant';

const { Search } = Input;

const DangKyKyTucXa = () => {
	const {
		getModel,
		danhSach,
		page,
		limit,
		setPage,
		setLimit,
		total,
		handleView,
		setVisibleDangKy,
		loading,
		setVisibleForm,
		setRecord,
		setFilters,
		filters,
	} = useModel('kytucxa.phong');

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');
	};

	useEffect(() => {
		getData();
	}, [page, limit, filters]);

	const handleFilterChange = useCallback((fieldPath: string[], value: any, operator = EOperatorType.EQUAL) => {
		setFilters((prevFilters: any) => {
			const currentFilters = prevFilters || [];
			const newFilters = currentFilters.filter((f: any) => JSON.stringify(f.field) !== JSON.stringify(fieldPath));
			
			if (value) {
				newFilters.push({
					field: fieldPath,
					operator: operator,
					values: Array.isArray(value) ? value : [value],
				});
			}
			return newFilters;
		});
		setPage(1);
	}, [setFilters, setPage]);

	const searchTenPhong = useMemo(() => _.debounce((val: string) => {
		const keyword = val.trim();
		handleFilterChange(['room', 'ten'], keyword, EOperatorType.CONTAIN);
	}, 500), [handleFilterChange]);

	const handleXemChiTiet = (phong: Phong.IChinhSachPhongRecord) => {
		handleView(phong);
	};

	const handleDangKy = (phong: Phong.IChinhSachPhongRecord) => {
		setVisibleForm(false);
		setRecord(phong);
		setVisibleDangKy(true);
	};

	const handlePaginationChange = (newPage: number, newPageSize: number) => {
		if (newPageSize !== limit) {
			setPage(1);
			setLimit(newPageSize);
		} else {
			setPage(newPage);
		}
	};

	const handlePageSizeChange = (current: number, size: number) => {
		setPage(1);
		setLimit(size);
	};

	return (
		<PageCard
			title='Đăng ký ký túc xá'
		>
			<Flex justify='space-between' align='center' style={{ marginBottom: 8 }}>
				<Space wrap>
					<Search
						placeholder='Tìm kiếm tên phòng'
						style={{ width: 250 }}
						allowClear
						onChange={(e) => searchTenPhong(e.target.value)}
						onSearch={(value) => {
							searchTenPhong.cancel();
							searchTenPhong(value);
							searchTenPhong.flush();
						}}
					/>
					<SelectToaNhaKTX 
						style={{ width: 250 }} 
						allowClear 
						onChange={(val) => handleFilterChange(['room', 'toaNha', '_id'], val, EOperatorType.EQUAL)}
					/>
					<SelectDanhMucChungKTX 
						condition={{ maLoai: 'LOAI_PHONG_KTX' }} 
						style={{ width: 250 }} 
						allowClear 
						onChange={(val) => handleFilterChange(['room', 'maLoaiPhongKtx'], val, EOperatorType.EQUAL)}
					/>
					<Select
						style={{ width: 250 }}
						placeholder='Chọn sức chứa'
						onChange={(val) => {
							if (val) {
								const [min, max] = val.split('-').map(Number);
								handleFilterChange(['room', 'soLuongToiDa'], [min, max], EOperatorType.BETWEEN);
							} else {
								handleFilterChange(['room', 'soLuongToiDa'], undefined, EOperatorType.BETWEEN);
							}
						}}
						options={[
							{
								value: '3-6',
								label: 'Từ 3 đến 6',
							},
							{
								value: '6-12',
								label: 'Từ 6 đến 12',
							},
							{
								value: '12-50',
								label: 'Từ 12 lên',
							},
						]}
						allowClear
					/>
				</Space>

				<Button icon={<ReloadOutlined />} onClick={getData} />
			</Flex>

			<Alert
				type='info'
				showIcon
				icon={<InfoCircleOutlined />}
				style={{ marginBottom: 12, marginTop: 12 }}
				message={
					<span>
						Registration is open from <b style={{ color: '#0E50CF' }}>31/07/2026</b> to{' '}
						<b style={{ color: '#0E50CF' }}>10/08/2026</b>.
					</span>
				}
			/>

			<hr
				style={{
					marginTop: 16,
					marginBottom: 16,
					border: 'none',
					borderTop: '1px solid #f0f0f0',
				}}
			/>

			<Spin spinning={loading}>
				{danhSach?.length ? (
					<>
						<Row gutter={[12, 12]}>
							{danhSach.map((phong) => (
								<Col key={phong._id} xs={24} md={12} xl={8} className='room-list-col'>
									<CardPhong phong={phong} onXemChiTiet={handleXemChiTiet} onDangKy={handleDangKy} />
								</Col>
							))}
						</Row>

						{total > 0 && (
							<div className='pagination-container'>
								<Pagination
									current={page}
									pageSize={limit}
									total={total}
									onChange={handlePaginationChange}
									onShowSizeChange={handlePageSizeChange}
									pageSizeOptions={['5', '10', '20', '50']}
									showSizeChanger={false}
									disabled={loading}
									size='default'
									className='pagination'
								/>
							</div>
						)}
					</>
				) : (
					<Empty style={{ marginTop: 32, marginBottom: 32 }} description='Không có dữ liệu' image='/images/empty.png' />
				)}
			</Spin>

			<ChiTietPhong />
			<ModalDanKyKTX getData={getData} />
		</PageCard>
	);
};

export default DangKyKyTucXa;
