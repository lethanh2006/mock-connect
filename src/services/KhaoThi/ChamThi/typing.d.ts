declare module ChamThi {
	export interface DiemCham {
		diem: number;
		updatedAt: string;
		diemThanhPhan: number[];
		trangThai: ETrangThaiChamThi;
		ssoId: string;
		ten: string;
		soTo: number;
		ten: string;
		coDiem: boolean;
	}

	export interface KetQuaChamThi {
		danhSachDiem: DiemCham[];
		chechLech: number;
		diemSauViPham: number;
		diemCuoi: number;
		diemChamLai: DiemCham[];
		danhSachCham: {
			coDiem: boolean;
		};
	}
}
