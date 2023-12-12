
import { ETrangThaiChamDiem } from '@/services/DiemRenLuyen/DotChamDiem/constants';
import {
	ELoaiNhapTayPhieuDiem,
	EVaiTroPhieuDiem,
	vaiTroPhieuDiem,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import { type PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/typing';
import rules from '@/utils/rules';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { Alert, Button, Form, InputNumber, Modal, Select, Space } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import StepDotChamDiemRenLuyen from '../../DotChamDiem/components/Step';
import TableStaticData from "@/components/Table/TableStaticData";
import {IColumn} from "@/components/Table/typing";

/** Dùng chung cho cả sinh viên, cán sự lớp, và cố vấn học tập */
const ModalPhieuDiem = (props: { role: EVaiTroPhieuDiem; onOk?: () => void }) => {
	const { record: recDot } = useModel('diemrenluyen.dotchamdiem');
	const {
		getCauHinhPhieuDiemModel,
		postKetQuaChamDiemModel,
		isLoadingKetQuaChamDiem,
		ketQuaChamDiem,
		visiblePhieuDiem,
		setVisiblePhieuDiem,
	} = useModel('diemrenluyen.phieudiemrenluyen');
	const [dataPhieu, setDataPhieu] = useState<PhieuDiemRenLuyen.IDataTable[]>([]);
	const [dataChamDiem, setDataChamDiem] = useState<PhieuDiemRenLuyen.IKetQuaTamThoi>();
	const [form] = Form.useForm();
	const { role, onOk } = props;
	const daNop = ketQuaChamDiem?.[vaiTroPhieuDiem[role].status] === ETrangThaiChamDiem.DA_NOP;
	const ngoaiThoiGian =
		role === EVaiTroPhieuDiem.SINH_VIEN
			? recDot?.thoiGianSVChamDiem &&
			  (moment().isAfter(recDot.thoiGianSVChamDiem.thoiGianKetThuc) ||
					moment().isBefore(recDot?.thoiGianSVChamDiem?.thoiGianBatDau))
			: role === EVaiTroPhieuDiem.CAN_SU
			? recDot?.thoiGianCanSuLopChamDiem &&
			  (moment().isAfter(recDot.thoiGianCanSuLopChamDiem.thoiGianKetThuc) ||
					moment().isBefore(recDot?.thoiGianCanSuLopChamDiem?.thoiGianBatDau))
			: recDot?.thoiGianCVHTChamDiem &&
			  (moment().isAfter(recDot.thoiGianCVHTChamDiem.thoiGianKetThuc) ||
					moment().isBefore(recDot?.thoiGianCVHTChamDiem?.thoiGianBatDau));
	const editable = !daNop && !ngoaiThoiGian;

	const getCauHinhPhieu = () => {
		getCauHinhPhieuDiemModel().then((phieu) => {
			const data: PhieuDiemRenLuyen.IDataTable[] = [];
			let ind = 0;
			phieu?.danhSachTieuChi?.map((tieuChi, index) => {
				data.push({
					_id: '-1',
					STT: '-1',
					tieuDe: `Tiêu chí ${index + 1}. ${tieuChi.tieuDe}`,
					diemQuyDinh: _.sum(
						tieuChi.danhSachNoiDung?.map((item) => Math.max(item.tapGiaTri.at(-1) || 0, 0)),
					).toString(),
					index: ind++,
					children: tieuChi.danhSachNoiDung?.map((noiDung) => ({
						...noiDung,
						diemQuyDinh: noiDung.tapGiaTri.join(' - '),
						index: ind++,
					})),
				});
			});
			setDataPhieu(data);
		});
	};

	const getData = () => {
		if (ketQuaChamDiem?._id) {
			const temp: Required<PhieuDiemRenLuyen.IKetQuaTamThoi> = {
				diemChamSinhVien: {},
				diemChamCanSu: {},
				diemChamCoVan: {},
				diemHeThong: {},
			};

			Object.values(vaiTroPhieuDiem).forEach((item) => {
				ketQuaChamDiem?.[item.field]?.map((item2) => {
					temp[item.field][item2.maNoiDung] = item2.diem;
				});
			});

			// Lấy điểm hệ thống được populate trong phiếu điểm trong kết quả trả về
			ketQuaChamDiem.phieuDiem?.danhSachTieuChi?.map((tieuChi) =>
				tieuChi.danhSachNoiDung?.map((nd) => (temp.diemHeThong[nd.maNoiDung] = nd.diemHeThong)),
			);

			setDataChamDiem(temp);
			form.resetFields();
			form.setFieldsValue(temp);
		}
	};

	useEffect(() => {
		getCauHinhPhieu();
	}, []);

	useEffect(() => {
		if (visiblePhieuDiem) {
			getData();
		}
	}, [visiblePhieuDiem, ketQuaChamDiem?._id]);

	const onChangeDiem = (field: keyof PhieuDiemRenLuyen.IDiemCham, maNoiDung: string, diem: number) => {
		if (dataChamDiem && maNoiDung) {
			const t = { ...dataChamDiem };
			t[field] = { ...t[field], [maNoiDung]: diem };
			setDataChamDiem(t);
		}
	};

	/** Tính điểm tổng hiện tại cho từng loại / tiêu chí */
	const calTongDiem = (recTieuChi: PhieuDiemRenLuyen.IDataTable, field: keyof PhieuDiemRenLuyen.IDiemCham) => {
		// Các mã nội dung thuộc tiêu chí hiện tại
		const maNoiDungCon = recTieuChi.children?.map((item) => item.maNoiDung);
		// Các kết quả của những mã nội dung này và của trường tương ứng
		const kq = Object.entries(dataChamDiem?.[field] ?? {})
			?.filter(([nd]) => maNoiDungCon?.includes(nd))
			?.map(([__, diem]) => diem ?? 0);
		// Điểm hệ thống
		const kqht = Object.entries(dataChamDiem?.diemHeThong ?? {})
			?.filter(([nd]) => maNoiDungCon?.includes(nd))
			?.map(([__, diem]) => diem ?? 0);

		const sum = _.sum(kq) + _.sum(kqht);
		return sum;
	};

	const doSubmit = (type: 'luu' | 'nop', diemCham: Partial<PhieuDiemRenLuyen.IDiemCham>) => {
		// Dùng extend array để lấy cả những nội dung chưa được render
		postKetQuaChamDiemModel(role, ketQuaChamDiem?._id ?? '', type, diemCham)
			.then(() => {
				setVisiblePhieuDiem(false);
				if (onOk) onOk();
			})
			.catch((er) => console.log(er));
	};

	const handleSubmit = (type: 'luu' | 'nop'): void => {
		if (ketQuaChamDiem?._id) {
			// Thực tế các điểm chấm đã được lưu ở `dataChamDiem` rồi nên ko cần lấy từ form
			const finalDiemCham = Object.entries(dataChamDiem?.[vaiTroPhieuDiem[role].field] ?? {}).map(
				([maNoiDung, diem]) => ({ maNoiDung, diem }),
			);
			if (type === 'nop')
				Modal.confirm({
					title: 'Bạn có muốn gửi phiếu điểm rèn luyện không?',
					content:
						role === EVaiTroPhieuDiem.SINH_VIEN
							? 'Phiếu sẽ được gửi đến ban cán sự để đánh giá và xét duyệt'
							: undefined,
					onOk: () => doSubmit(type, { [vaiTroPhieuDiem[role].field]: finalDiemCham }),
				});
			else doSubmit(type, { [vaiTroPhieuDiem[role].field]: finalDiemCham });
		}
	};

	const TitleRender = () => (
		<div style={{ marginBottom: 12, marginTop: 18 }}>
			<h2 style={{ textAlign: 'center', marginBottom: 0 }}>PHIẾU ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN</h2>
			<div style={{ textAlign: 'center', marginBottom: 12 }}>{recDot?.tenDot}</div>

			{editable ? (
				<div style={{ fontStyle: 'italic', color: 'red' }}>
					Lưu ý: Những ô màu xám là điểm hệ thống tự động tính. Sinh viên chỉ thực hiện chấm điểm ở những ô sáng màu
				</div>
			) : (
				<Alert
					type='warning'
					showIcon
					message={
						daNop
							? `Phiếu điểm đã được gửi đi, vui lòng chờ ${
									role === EVaiTroPhieuDiem.SINH_VIEN ? 'cán sự lớp,' : ''
							  } CVHT đánh giá`
							: `Ngoài thời gian ${vaiTroPhieuDiem[role].title.toLocaleLowerCase()} đánh giá điểm rèn luyện`
					}
				/>
			)}
		</div>
	);

	const ButtonsRender = () => (
		<div style={{ textAlign: 'center', marginTop: 18 }}>
			<Space wrap>
				{editable ? (
					<>
						<Button type='primary' icon={<SendOutlined />} onClick={() => handleSubmit('nop')}>
							Gửi
						</Button>
						<Button onClick={() => handleSubmit('luu')} icon={<SaveOutlined />}>
							Lưu & Gửi sau
						</Button>
					</>
				) : null}
				<Button onClick={() => setVisiblePhieuDiem(false)}>Đóng</Button>
			</Space>
		</div>
	);

	const onCell = (rec: PhieuDiemRenLuyen.IDataTable) => ({
		style: { cursor: rec._id === '-1' ? 'pointer' : undefined },
	});

	const columns: IColumn<PhieuDiemRenLuyen.IDataTable & { index: number }>[] = [
		{
			width: 20,
			align: 'center',
		},
		{
			title: 'TT',
			dataIndex: 'STT',
			width: 40,
			align: 'center',
			onCell: (rec) => ({
				colSpan: rec.STT === '-1' ? 0 : 1,
			}),
		},
		{
			title: 'Nội dung đánh giá',
			dataIndex: 'tieuDe',
			width: 350,
			onCell: (rec) => ({
				style: {
					fontWeight: rec.STT === '-1' ? 600 : undefined,
					cursor: rec._id === '-1' ? 'pointer' : undefined,
				},
				colSpan: rec._id === '-1' ? 2 : 1,
			}),
		},
		{
			title: 'Điểm quy định',
			dataIndex: 'diemQuyDinh',
			align: 'center',
			width: 80,
			onCell: (rec) => ({
				...onCell(rec),
				// colSpan: rec._id === '-1' ? 0 : 1,
			}),
		},
	];
	Object.values(EVaiTroPhieuDiem).map((vaiTro) =>
		columns.push({
			title: vaiTroPhieuDiem[vaiTro].title,
			width: 80,
			align: 'center',
			render: (__, rec) =>
				rec.STT === '-1' ? (
					calTongDiem(rec, vaiTroPhieuDiem[vaiTro].field)
				) : rec.loaiNoiDung === 'Nhập tay' ? (
					<Form.Item
						name={[vaiTroPhieuDiem[vaiTro].field, rec.maNoiDung ?? '']}
						style={{ marginBottom: 0 }}
						rules={
							!editable || role !== vaiTro
								? undefined
								: [
										...(rec.loaiNhapTay === ELoaiNhapTayPhieuDiem.PHAM_VI
											? rules.number(rec.tapGiaTri?.[1] ?? 10, rec.tapGiaTri?.[0] ?? 0, false)
											: []),
								  ]
						}
					>
						{rec.loaiNhapTay === ELoaiNhapTayPhieuDiem.PHAM_VI ? (
							<InputNumber
								style={{ width: 80 }}
								min={rec.tapGiaTri?.[0] ?? 0}
								max={rec.tapGiaTri?.[1] ?? 10}
								disabled={!editable || role !== vaiTro}
								placeholder='---'
								onChange={(val) => onChangeDiem(vaiTroPhieuDiem[vaiTro].field, rec.maNoiDung ?? '', val || 0)}
							/>
						) : (
							<Select
								style={{ width: 80, textAlign: 'left' }}
								options={rec?.tapGiaTri?.map((item: number) => ({
									value: item,
									label: item,
									key: item,
								}))}
								disabled={!editable || role !== vaiTro}
								placeholder='---'
								onChange={(val) => onChangeDiem(vaiTroPhieuDiem[vaiTro].field, rec.maNoiDung ?? '', val || 0)}
							/>
						)}
					</Form.Item>
				) : (
					<Form.Item name={['diemHeThong', rec.maNoiDung ?? '']} style={{ marginBottom: 0 }}>
						<InputNumber disabled placeholder='---' style={{ width: 80 }} />
					</Form.Item>
				),
			onCell,
		}),
	);

	return (
		<Modal
			visible={visiblePhieuDiem}
			onCancel={() => setVisiblePhieuDiem(false)}
			width={1200}
			footer={null}
			maskClosable={false}
		>
			<StepDotChamDiemRenLuyen />

			<TitleRender />

			<Form form={form} component={false}>
				<TableStaticData
					columns={columns}
					data={dataPhieu}
					loading={isLoadingKetQuaChamDiem}
					otherProps={{
						pagination: false,
						scroll: { x: 800, y: 600 },
						rowKey: (row: any) => row.index,
						size: 'small',
						expandable: { expandRowByClick: true },
					}}
				/>

				<ButtonsRender />
			</Form>
		</Modal>
	);
};

export default ModalPhieuDiem;
