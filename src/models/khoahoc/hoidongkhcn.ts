import useInitModel from '@/hooks/useInitModel';
import type { HoiDongKHCN } from '@/services/KhoaHoc/HoiDongKHCN/typings';

import {
	canBoGetAllNhanXet,
	canBoGetNhanXetDeTai,
	diemDanh,
	exportDSThanhVienHoiDong,
	exportQuyetDinhThanhLapHoiDong,
	giangVienGetNhanXetDeTai,
	guiMailThanhVienHoiDong,
	guiNhanXetDeTai,
	ketThucHoiDong,
	updateKetQuaXetDuyet,
} from '@/services/KhoaHoc/HoiDongKHCN';

import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { ELoaiHoiDongKHCN } from '@/services/KhoaHoc/HoiDongKHCN/constants';
import { message } from 'antd';
import FileDownload from 'js-file-download';
import { useState } from 'react';

export default () => {
	const [danhSachThanhVienHoiDong, setDanhSachThanhVienHoiDong] = useState<DeTaiKHCN.ThanhVienDeTai[]>([]);

	const [recordThanhVienHoiDong, setRecordThanhVienHoiDong] = useState<DeTaiKHCN.ThanhVienDeTai>();
	const [editThanhVienHoiDong, setEditThanhVienHoiDong] = useState<boolean>(false);
	const [visibleFormThanhVienHoiDong, setVisibleFormThanhVienHoiDong] = useState<boolean>(false);
	const [danhSachThanhVienThamDu, setDanhSachThanhVienThamDu] = useState<DeTaiKHCN.ThanhVienDeTai[]>([]);

	const [recordThanhVienThamDu, setRecordThanhVienThamDu] = useState<DeTaiKHCN.ThanhVienDeTai>();
	const [editThanhVienThamDu, setEditThanhVienThamDu] = useState<boolean>(false);
	const [visibleFormThanhVienThamDu, setVisibleFormThanhVienThamDu] = useState<boolean>(false);

	const [danhSachDeTai, setDanhSachDeTai] = useState<DeTaiKHCN.IRecord[]>([]);
	const [recordDeTai, setRecordDeTai] = useState<DeTaiKHCN.IRecord>();
	const [editDeTai, setEditDeTai] = useState<boolean>(false);
	const [visibleFormDeTai, setVisibleFormDeTai] = useState<boolean>(false);

	const [loaiHoiDong, setLoaiHoiDong] = useState<ELoaiHoiDongKHCN>(ELoaiHoiDongKHCN.XET_DUYET);

	const [visibleFormCapNhatKetQuaHop, setVisibleFormCapNhatKetQuaHop] = useState<boolean>(false);
	const [visibleViewDetail, setVisibleViewDetail] = useState<boolean>(false);
	const [visibleFormImportQuyetDinhThanhLapHoiDong, setVisibleFormImportQuyetDinhThanhLapHoiDong] =
		useState<boolean>(false);
	const [currentStep, setCurrentStep] = useState<number>(0);

	const [danhSachNhanXet, setDanhSachNhanXet] = useState<HoiDongKHCN.NhanXetHoiDong[]>([]);
	const [recordNhanXet, setRecordNhanXet] = useState<HoiDongKHCN.NhanXetHoiDong>();
	const [visibleFormNhanXet, setVisibleFormNhanXet] = useState<boolean>(false);
	const objInitModel = useInitModel<HoiDongKHCN.IRecord>('hoi-dong-khcn');

	const { setLoading, setRecord } = objInitModel;

	const [pageNhanXet, setPageNhanXet] = useState<number>(1);
	const [limitNhanXet, setLimitNhanXet] = useState<number>(10);
	const [conditionNhanXet, setConditionNhanXet] = useState<any>({});
	const [filterInfoNhanXet, setFilterInfoNhanXet] = useState<any>({});
	const [totalNhanXet, setTotalNhanXet] = useState<any>({});

	const updateKetQuaXetDuyetModel = async (
		idHoiDong: string,
		payload: {
			bienBanUrl: string[];
			xetDuyet: HoiDongKHCN.KetQuaDeTaiHoiDong[];
		},
		getData?: any,
	) => {
		try {
			setLoading(true);
			await updateKetQuaXetDuyet(idHoiDong, payload);
			message.success('Xử lý thành công');
			setVisibleFormCapNhatKetQuaHop(false);
			setLoading(false);
			if (getData) {
				getData();
			}
		} catch (err) {
			setLoading(false);
		}
	};

	const guiMailThanhVienHoiDongModel = async (idHoiDong: string) => {
		try {
			setLoading(true);
			await guiMailThanhVienHoiDong(idHoiDong);
			message.success('Gửi thành công');
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	const diemDanhModel = async (
		idHoiDong: string,
		payload: { danhSachThanhVien: DeTaiKHCN.ThanhVienDeTai[] },
		getData: any,
	) => {
		setLoading(true);
		await diemDanh(idHoiDong, payload);
		message.success('Điểm danh thành công');
		if (getData) getData();
	};

	const giangVienGetNhanXetDeTaiModel = async (idHoiDong: string, idDeTai: string) => {
		setLoading(true);
		const res = await giangVienGetNhanXetDeTai(idHoiDong, idDeTai, {
			page: pageNhanXet,
			limit: limitNhanXet,
			condition: conditionNhanXet,
		});
		setDanhSachNhanXet(res?.data?.data?.result ?? []);
		setTotalNhanXet(res?.data?.data?.total ?? 0);
		setLoading(false);
	};

	const canBoGetNhanXetDeTaiModel = async (idHoiDong: string, idDeTai: string) => {
		if (!idHoiDong || !idDeTai) return;
		setLoading(true);
		const res = await canBoGetNhanXetDeTai(idHoiDong, idDeTai, {
			page: pageNhanXet,
			limit: limitNhanXet,
			condition: conditionNhanXet,
		});
		setDanhSachNhanXet(res?.data?.data?.result ?? []);
		setRecordNhanXet(res?.data?.data?.result?.[0] ?? {});
		setTotalNhanXet(res?.data?.data?.total ?? 0);
		setLoading(false);
	};

	const canBoGetAllNhanXetModel = async (idHoiDong: string, idDeTai: string) => {
		setLoading(true);
		const res = await canBoGetAllNhanXet(idHoiDong, {
			page: pageNhanXet,
			limit: limitNhanXet,
			condition: { ...conditionNhanXet, deTaiId: idDeTai },
		});
		setDanhSachNhanXet(res?.data?.data?.result ?? []);
		setTotalNhanXet(res?.data?.data?.total ?? 0);
		setLoading(false);
	};

	const guiNhanXetDeTaiModel = async (
		idHoiDong: string,
		idDeTai: string,
		payload: {
			nhanXet: string;
			urlBienBan: string;
		},
	) => {
		if (!idHoiDong || !idDeTai) return;
		setLoading(true);
		await guiNhanXetDeTai(idHoiDong, idDeTai, payload);
		message.success('Gửi thành công');
		setVisibleFormNhanXet(false);
		canBoGetNhanXetDeTaiModel(idHoiDong, idDeTai);
	};

	const ketThucHoiDongModel = async (idHoiDong: string, getData: any) => {
		setLoading(true);
		const res = await ketThucHoiDong(idHoiDong);
		message.success('Xử lý thành công');
		setRecord(res.data.data);
		if (getData) getData();
		else setLoading(false);
	};

	const exportDSThanhVienHoiDongModel = async (idHoiDong: string) => {
		setLoading(true);
		const res = await exportDSThanhVienHoiDong(idHoiDong);
		FileDownload(res.data, `DanhSachThanhVienHoiDong_${idHoiDong}.xlsx`);
		setLoading(false);
	};
	const exportQuyetDinhThanhLapHoiDongModel = async (idHoiDong: string, loai: ELoaiHoiDongKHCN, tenHoiDong: string) => {
		setLoading(true);
		const res = await exportQuyetDinhThanhLapHoiDong(idHoiDong, loai);
		FileDownload(res.data, `QuyetDinhThanhLapHoiDong_${tenHoiDong}.docx`);
		setLoading(false);
	};

	return {
		visibleFormImportQuyetDinhThanhLapHoiDong,
		setVisibleFormImportQuyetDinhThanhLapHoiDong,
		exportQuyetDinhThanhLapHoiDongModel,
		exportDSThanhVienHoiDongModel,
		ketThucHoiDongModel,
		recordNhanXet,
		setRecordNhanXet,
		visibleFormNhanXet,
		setVisibleFormNhanXet,
		filterInfoNhanXet,
		setFilterInfoNhanXet,
		limitNhanXet,
		setLimitNhanXet,
		pageNhanXet,
		setPageNhanXet,
		danhSachNhanXet,
		setDanhSachNhanXet,
		conditionNhanXet,
		setConditionNhanXet,
		totalNhanXet,
		setTotalNhanXet,
		guiNhanXetDeTaiModel,
		giangVienGetNhanXetDeTaiModel,
		canBoGetNhanXetDeTaiModel,
		canBoGetAllNhanXetModel,
		diemDanhModel,
		currentStep,
		setCurrentStep,
		visibleViewDetail,
		setVisibleViewDetail,

		guiMailThanhVienHoiDongModel,
		visibleFormCapNhatKetQuaHop,
		setVisibleFormCapNhatKetQuaHop,
		updateKetQuaXetDuyetModel,
		loaiHoiDong,
		setLoaiHoiDong,
		recordDeTai,
		setRecordDeTai,
		editDeTai,
		setEditDeTai,
		visibleFormDeTai,
		setVisibleFormDeTai,
		recordThanhVienThamDu,
		setRecordThanhVienThamDu,
		editThanhVienThamDu,
		setEditThanhVienThamDu,
		visibleFormThanhVienThamDu,
		setVisibleFormThanhVienThamDu,
		recordThanhVienHoiDong,
		setRecordThanhVienHoiDong,
		editThanhVienHoiDong,
		setEditThanhVienHoiDong,
		visibleFormThanhVienHoiDong,
		setVisibleFormThanhVienHoiDong,
		danhSachDeTai,
		setDanhSachDeTai,
		danhSachThanhVienHoiDong,
		setDanhSachThanhVienHoiDong,
		danhSachThanhVienThamDu,
		setDanhSachThanhVienThamDu,

		...objInitModel,
	};
};
