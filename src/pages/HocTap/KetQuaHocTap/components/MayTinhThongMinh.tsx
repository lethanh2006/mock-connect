import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type DiemHocPhan } from '@/services/DaoTao/DiemHocPhan/typing';
import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import rules from '@/utils/rules';
import { convertNumberScoreToAlphabet } from '@/utils/utils';
import {
	Button,
	Card,
	Checkbox,
	Col,
	Descriptions,
	Form,
	InputNumber,
	Modal,
	Popover,
	Row,
	Segmented,
	Tag,
} from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const MayTinhThongMinh = (props: { maKhoaNganh?: string }) => {
	const { maKhoaNganh } = props;
	const { getDiemSinhVienModel, loading, tongTuChon } = useModel('daotao.diemhocphan');
	const { getAllModel: getLoaiHp, danhSach: danhSachLoaiHp } = useModel('daotao.loaihocphan');
	const [danhSach, setDanhSach] = useState<DiemHocPhan.IDiemSinhVien[]>();
	const [record, setRecord] = useState<DiemHocPhan.IDiemSinhVien>();
	const [tongKet, setTongKet] = useState<number>(0);
	const [tuChonCoDiem, setTuChonCoDiem] = useState<number>(0);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [showAll, setShowAll] = useState<string>('none');
	const [form] = Form.useForm();
	const loaiHpTinhDiem = danhSachLoaiHp.filter((i) => i.isTinhDiem).map((i) => i.ma);

	const tinhDiemTongKet = (data: DiemHocPhan.IDiemSinhVien[]) => {
		const tongDiem = _.sumBy(data, (item) => {
			if (!loaiHpTinhDiem.includes(item.maLoaiHocPhan)) return 0;
			const diem = (item.diemDuKienThang4 ?? item.diemThang4 ?? 0) * (item.soTinChi ?? 0);
			return diem;
		});
		const tongTinChi = _.sumBy(data, (item) =>
			loaiHpTinhDiem.includes(item.maLoaiHocPhan) && (item.diemDuKienThang4 || item.diemThang4)
				? item.soTinChi ?? 0
				: 0,
		);
		setTongKet(Math.round(tongTinChi === 0 ? 0 : (tongDiem * 100) / tongTinChi) / 100);

		const monTuChonCoDiem = data.filter(
			(item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON && (item.diemDuKienThang4 || item.diemThang4),
		);
		setTuChonCoDiem(_.sumBy(monTuChonCoDiem, (item) => item.soTinChi ?? 0));
	};

	const fetch = async () => {
		await getDiemSinhVienModel({ maKhoaNganh }).then((data) => {
			tinhDiemTongKet(data);
			setDanhSach(data);
		});
	};

	useEffect(() => {
		getLoaiHp();
	}, []);

	useEffect(() => {
		if (maKhoaNganh && danhSachLoaiHp.length) fetch();
	}, [maKhoaNganh, danhSachLoaiHp.length]);

	const onOk = (values: any) => {
		const data = danhSach?.map((item) =>
			item.ma === record?.ma
				? {
						...record,
						diemDuKien: parseFloat(values.diemDuKien) || undefined,
						diemDuKienThang4: parseFloat(convertNumberScoreToAlphabet(values.diemDuKien)[1]) || undefined,
				  }
				: item,
		);
		tinhDiemTongKet(data ?? []);
		setDanhSach(data);
		setModalVisible(false);
	};

	const onCell = (rec: DiemHocPhan.IDiemSinhVien) => ({
		onClick: () => {
			setRecord(rec);
			form.setFieldsValue({
				diemDuKien: rec?.diemDuKien ?? rec?.diemTongKet ?? undefined,
			});
			setModalVisible(true);
		},
		style: {
			cursor: 'pointer',
			backgroundColor: !rec.diemThang4 && !rec.diemDuKienThang4 ? '#f7dcdcbd' : undefined,
			color: !rec.diemThang4 && !rec.diemDuKienThang4 ? 'red' : undefined,
		},
	});

	const columns: IColumn<DiemHocPhan.IDiemSinhVien>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			dataIndex: 'ma',
			title: 'Mã HP',
			filterType: 'string',
			sortable: true,
			width: 100,
			onCell,
		},
		{
			dataIndex: 'ten',
			title: 'Tên học phần',
			filterType: 'string',
			width: 200,
			onCell,
		},
		{
			dataIndex: 'soTinChi',
			title: 'STC',
			width: 60,
			align: 'center',
			onCell,
		},
		{
			dataIndex: 'loaiHocPhanCtdt',
			title: 'Loại HP',
			width: 80,
			align: 'center',
			// render: (val: ELoaiHocPhanCTDT) =>
			// 	val && <Tag color={val === ELoaiHocPhanCTDT.BAT_BUOC ? 'orange' : 'blue'}>{val}</Tag>,
			onCell,
		},
		{
			title: 'HP tính điểm',
			width: 60,
			align: 'center',
			render: (val, rec) => <Checkbox disabled checked={loaiHpTinhDiem.includes(rec.maLoaiHocPhan)} />,
			onCell,
		},
		{
			dataIndex: 'diemThang4',
			title: 'Điểm tổng kết (hệ 4)',
			width: 80,
			align: 'center',
			onCell,
		},
		{
			dataIndex: 'diemDuKien',
			title: 'Điểm dự kiến (hệ 10)',
			render: (s) => <b>{s}</b>,
			width: 80,
			align: 'center',
			onCell,
		},
		{
			dataIndex: 'diemDuKienThang4',
			title: 'Điểm dự kiến (hệ 4)',
			render: (s) => <b>{s}</b>,
			width: 80,
			align: 'center',
			onCell,
		},
	];

	return (
		<>
			<Row gutter={[12, 12]}>
				{/* <Text italic style={{ marginBottom: '16px' }}>
        * Lưu ý: Những điểm &#34;--&#34; là do bạn chưa đánh giá giảng viên. Vui lòng đánh giá để
        xem điểm!
      </Text> */}
				<Col span={24}>
					Tại đây sinh viên có thể thực hiện &quot;giả lập điểm&quot;, để chủ động trong việc đăng ký học lại, học cải
					thiện.{' '}
					<Popover
						content={
							<div style={{ maxWidth: 600 }}>
								Bước 1: Sinh viên ấn vào môn muốn nhập điểm cải thiện;
								<br />
								Bước 2: Tại popup Giả lập điểm, sinh viên nhập điểm mong muốn (chỉ nhập điểm từ 4 - 10) tại trường{' '}
								<b>Điểm dự kiến sau khi học lại / cải thiện (hệ 10)</b>;
								<br />
								Bước 3: Ấn OK.
								<br />
								Hệ thống sẽ tự động quy đổi điểm từ hệ 10 sang hệ 4 và tính lại điểm trung bình tích lũy hệ 4
							</div>
						}
					>
						<a>(Xem thêm)</a>
					</Popover>
				</Col>
				<Col span={24}>
					Điểm tổng kết dự kiến sau khi đã cải thiện và học lại:{' '}
					{/* Hệ 10:{' '}
        <b style={{ fontSize: '1.5rem',  }}>{tongKet}</b>
        <Divider type="vertical" /> */}
					<b style={{ fontSize: '1.3rem', marginLeft: 8 }} className='text-primary'>
						{tongKet}
					</b>{' '}
					/ 4
					{/* <Divider type="vertical" />
        Dạng chữ: <b style={{ fontSize: '1.5rem',  }}>{chuDuKien}</b> */}
				</Col>
				<Col span={24}>
					Số tín chỉ tự chọn đã có điểm:{' '}
					<b className={tuChonCoDiem === tongTuChon ? 'text-success' : 'text-error'}>
						{tuChonCoDiem} / {tongTuChon}
					</b>{' '}
					(tổng số tín chỉ tự chọn phải học).
				</Col>

				<Col span={24} style={{ marginTop: 12 }}>
					<TableStaticData
						columns={columns}
						data={
							danhSach?.filter((item) => showAll === 'all' || (item.trangThai && item.trangThai !== 'Chưa có điểm')) ??
							[]
						}
						otherProps={{ scroll: { y: 600 }, pagination: false }}
						loading={loading}
						hasTotal
					>
						<Segmented
							value={showAll}
							onChange={(val) => setShowAll(val.toString())}
							options={[
								{ value: 'none', label: 'Các môn đã học' },
								{ value: 'all', label: 'Tất cả các môn học' },
							]}
						/>
					</TableStaticData>
				</Col>
			</Row>

			<Modal
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				width={600}
				footer={null}
				bodyStyle={{ padding: 0 }}
			>
				<Card title='Giả lập điểm'>
					<Descriptions column={1}>
						<Descriptions.Item label='Mã học phần'>{record?.ma}</Descriptions.Item>
						<Descriptions.Item label='Tên học phần'>{record?.ten}</Descriptions.Item>
						<Descriptions.Item label='Số tín chỉ'>{record?.soTinChi} tín chỉ</Descriptions.Item>
						<Descriptions.Item label='Điểm tổng kết (hệ 10)'>{record?.diemTongKet}</Descriptions.Item>
						<Descriptions.Item label='Điểm tổng kết (hệ 4)'>{record?.diemThang4}</Descriptions.Item>
						<Descriptions.Item label='Điểm tổng kết (dạng chữ)'>
							{record?.diemChu ? <Tag color={ColorDiemChu[record?.diemChu]}>{record?.diemChu}</Tag> : null}
						</Descriptions.Item>
						<Descriptions.Item label='Trạng thái'>{record?.trangThai}</Descriptions.Item>
					</Descriptions>

					<Form form={form} onFinish={onOk}>
						<Form.Item
							name='diemDuKien'
							label={<span className='fw500'>Điểm dự kiến sau khi học lại / cải thiện (hệ 10)</span>}
							rules={[...rules.number(10, 4)]}
						>
							<InputNumber placeholder='Nhập điểm dự kiến' min={4} max={10} style={{ width: '100%' }} />
						</Form.Item>

						<div className='form-footer' style={{ width: '100%' }}>
							<Button htmlType='submit' type='primary'>
								Đồng ý
							</Button>
							<Button onClick={() => setModalVisible(false)}>Hủy</Button>
						</div>
					</Form>
				</Card>
			</Modal>
		</>
	);
};

export default MayTinhThongMinh;
