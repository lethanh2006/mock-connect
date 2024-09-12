import ButtonExtend from '@/components/Table/ButtonExtend';
import { ReloadOutlined } from '@ant-design/icons';
import { Modal, Segmented, Skeleton, Spin } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useModel } from 'umi';
import '../../LopHocPhan/DienDan/style.less';
import CardStatusBaiTap from './components/CardStatusBaiTap';
import FormBaiTap from './components/Form';

const BaiTapPage = (props: { lopHocPhanId: string }) => {
	const { lopHocPhanId } = props;
	const { getModel, danhSach, loading, setLimit, limit, total, visibleForm, setVisibleForm } =
		useModel('daotao.baitap');

	const [segment, setSegment] = useState<string>('1');

	const getData = () => {
		if (lopHocPhanId)
			getModel(
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				`lop-hoc-phan/${lopHocPhanId}/me/${segment === '1' ? 'dang-dien-ra' : 'da-ket-thuc'}`,
			);
	};

	useEffect(() => {
		getData();
	}, [lopHocPhanId, segment]);

	return (
		<div className='dien-dan'>
			<Spin spinning={loading}>
				<div className='main-content'>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
						<Segmented
							value={segment}
							onChange={(val) => setSegment(val.toString())}
							options={[
								{ value: '1', label: 'Đang diễn ra' },
								{ value: '2', label: 'Đã kết thúc' },
							]}
						/>
						<ButtonExtend icon={<ReloadOutlined />} onClick={() => getData()}>
							Tải lại
						</ButtonExtend>
					</div>
					{!danhSach?.length ? (
						<div style={{ textAlign: 'center' }}>
							<div style={{ marginBottom: 8 }}>
								<img src='/images/bai-tap.svg' />
							</div>
							<div>
								<b>Hiện tại lớp tín chỉ chưa có bài tập</b> <br />
								<span>Theo dõi thông báo để không bỏ lỡ bài tập nào!</span>
							</div>
						</div>
					) : (
						<>
							<InfiniteScroll
								style={{ overflow: 'unset' }}
								dataLength={danhSach?.length}
								next={() => {
									if (loading) return;
									setLimit(limit + 5);
								}}
								hasMore={danhSach?.length < total}
								loader={
									<div style={{ padding: '12px 24px' }}>
										<Skeleton paragraph={{ rows: 3 }} active />
									</div>
								}
								scrollableTarget='body'
							>
								{danhSach?.map((val) => (
									<CardStatusBaiTap key={val._id} data={val} />
								))}
							</InfiniteScroll>
						</>
					)}
				</div>
			</Spin>
			<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} width={800} title='Nộp bài tập'>
				<FormBaiTap getData={getData} />
			</Modal>
		</div>
	);
};

export default BaiTapPage;
