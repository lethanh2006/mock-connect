import ButtonExtend from '@/components/Table/ButtonExtend';
import { DesktopOutlined, GlobalOutlined } from '@ant-design/icons';
import { Descriptions, Space, Spin, Tabs, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalHocPhan from '../../../DaoTao/DeCuongHocPhan/ModalHocPhan';
import DanhSachGiangVien from './DanhSachGiangVien';
import DanhSachSinhVien from './DanhSachSinhVien';
import GioiThieuChungLopHp from './GioiThieuChung';

const ThongTinChung = () => {
	const { loading, record, getMoodleLopHocPhanModel } = useModel('lophocphan.lophocphan');
	const {
		record: recLopThucHanh,
		danhSach: danhSachLopThucHanh,
		sinhVienGetByIdModel: getByIdLopThucHanh,
		sinhVienGetModel: getLopThucHanh,
		danhSachNhanSu: danhSachNhanSuLopTH,
		getAllNhanSuModel: getNhanSuLopTH,
		loading: loadingThucHanh,
	} = useModel('daotao.lopthuchanh');
	const [activeKey, setActiveKey] = useState<string>('-1');
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);

	useEffect(() => {
		setActiveKey('-1');
		if (record?._id) {
			getLopThucHanh({ tenCha: record?.ten });
		}
	}, [record?._id]);

	useEffect(() => {
		if (activeKey !== '-1') {
			getByIdLopThucHanh(activeKey);
			getNhanSuLopTH(activeKey);
		}
	}, [activeKey]);

	const handleMoodle = () => {
		if (record?.moodleShortname && record?._id)
			getMoodleLopHocPhanModel(record._id).then((data) => {
				if (data?.url) window.open(`${data.url}`);
				else message.error('Có lỗi, vui lòng thử lại sau');
			});
	};

	return (
		<Spin spinning={loading}>
			<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} title='Thông tin lớp'>
				<Descriptions.Item label='Học phần' span={2}>
					{record?.hocPhan?.ten ? (
						<Tooltip title='Xem đề cương chi tiết học phần'>
							<a onClick={() => setVisibleDeCuong(true)}>
								<b>{record?.hocPhan?.ten ?? ''}</b>
							</a>
						</Tooltip>
					) : (
						<i>Chưa cập nhật</i>
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Mã học phần'>{record?.hocPhan?.ma ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Số tín chỉ'>{record?.hocPhan?.soTinChi ?? '--'} tín chỉ</Descriptions.Item>
				{/* <Descriptions.Item label='Sĩ số'>{record?.siSo ?? 0} sinh viên</Descriptions.Item> */}
			</Descriptions>

			<GioiThieuChungLopHp />

			<Space wrap style={{ marginTop: 8 }}>
				{record?.lmsUrl ? (
					<ButtonExtend notHideText icon={<GlobalOutlined />} onClick={() => window.open(record.lmsUrl, '_blank')}>
						Học trực tuyến
					</ButtonExtend>
				) : null}
				{record?.moodleShortname ? (
					<ButtonExtend notHideText icon={<DesktopOutlined />} onClick={handleMoodle}>
						Lớp học LMS
					</ButtonExtend>
				) : null}
			</Space>

			{/* <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>
        Thông tin điểm danh của bạn
      </h4>
      <div style={{ marginBottom: 12 }}>
        Vắng có phép: --
        <Divider type="vertical" />
        Vắng không phép: -- <a>(xem chi tiết)</a>
      </div> */}

			<Tabs activeKey={activeKey} onChange={(val) => setActiveKey(val)} style={{ marginTop: 16 }}>
				<Tabs.TabPane tab='Danh sách sinh viên' key='-1' />
				{danhSachLopThucHanh?.map((item) => (
					<Tabs.TabPane tab={`Nhóm ${item.loai} ${item.soThuTuNhom}`} key={item._id} />
				))}
			</Tabs>

			{activeKey !== '-1' ? (
				<DanhSachGiangVien danhSachNhanSu={danhSachNhanSuLopTH} title='Giảng viên phụ trách nhóm lớp' />
			) : null}

			<DanhSachSinhVien
				sinhVienList={activeKey !== '-1' ? recLopThucHanh?.sinhVienList ?? [] : record?.sinhVienList ?? []}
				loading={loading || loadingThucHanh}
				fromLopHocPhan
			/>

			{/* <Modal
        title="Vắng điểm danh"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        okButtonProps={{ hidden: true }}
        cancelText="Đóng"
      >
        <VangDiemDanh
          data={thongTinChung?.soBuoiVang?.concat(thongTinChung.soBuoiVangCoPhep) ?? []}
        />
      </Modal> */}

			<ModalHocPhan visible={visibleDeCuong} setVisible={setVisibleDeCuong} title='Chi tiết đề cương học phần' />
		</Spin>
	);
};

export default ThongTinChung;
