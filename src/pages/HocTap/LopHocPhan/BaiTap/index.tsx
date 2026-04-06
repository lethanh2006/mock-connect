import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { ReloadOutlined } from '@ant-design/icons';
import { Segmented, Skeleton, Spin } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl, useModel } from 'umi';
import '../../LopHocPhan/DienDan/style.less';
import CardStatusBaiTap from './components/CardStatusBaiTap';
import FormBaiTap from './components/Form';

const BaiTapPage = (props: { lopHocPhanId: string }) => {
	const intl = useIntl();
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
								{ value: '1', label: intl.formatMessage({ id: 'lophocphan.id.baitap.dangdienra' }) },
								{ value: '2', label: intl.formatMessage({ id: 'lophocphan.id.baitap.quahan' }) },
							]}
						/>
						<ButtonExtend icon={<ReloadOutlined />} onClick={() => getData()}>
							{intl.formatMessage({ id: 'lophocphan.id.baitap.tailai' })}
						</ButtonExtend>
					</div>
					{!danhSach?.length ? (
						<div style={{ textAlign: 'center' }}>
							<div style={{ marginBottom: 8 }}>
								<img src='/student/images/bai-tap.svg' />
							</div>
							<div>
								<b>{intl.formatMessage({ id: 'lophocphan.id.baitap.noti1' })}</b> <br />
								<span>{intl.formatMessage({ id: 'lophocphan.id.baitap.noti2' })}</span>
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
								{danhSach?.map((val) => <CardStatusBaiTap key={val._id} data={val} />)}
							</InfiniteScroll>
						</>
					)}
				</div>
			</Spin>
			<ModalExpandable
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={800}
				title={intl.formatMessage({ id: 'lophocphan.id.baitap.title' })}
			>
				<FormBaiTap getData={getData} />
			</ModalExpandable>
		</div>
	);
};

export default BaiTapPage;
