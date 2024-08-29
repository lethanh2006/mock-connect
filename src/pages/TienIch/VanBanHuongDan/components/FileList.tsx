import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type VanBanHuongDan } from '@/services/TienIch/VanBanHuongDan/typing';
import { ELoaiThongTinXemSau } from '@/services/XemSau/constant';
import { FileExcelOutlined, PaperClipOutlined, SaveOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FileList = () => {
	const { record } = useModel('tienich.vanbanhuongdan');
	const {
		postModel: postXemSau,
		getAllModel: getAllXemSau,
		danhSach: danhSachXemSau,
		deleteModel,
	} = useModel('xemsau');
	const { getThongTinCuaToiModel, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [loadingXemSau, setLoadingXemSau] = useState<boolean>(false);

	const getDataXemSau = () => {
		getAllXemSau(undefined, undefined, { loaiThongTin: ELoaiThongTinXemSau.VBHD }, undefined, 'me/many');
	};

	useEffect(() => {
		getThongTinCuaToiModel();
		getDataXemSau();
	}, []);

	const handleXemSau = (rec: any) => {
		setLoadingXemSau(true);
		const data = {
			userSsoId: recSinhVien?.ssoId,
			sourceId: rec?._id,
			loaiThongTin: ELoaiThongTinXemSau.VBHD,
			thongTin: rec,
		};
		postXemSau(data, getDataXemSau, undefined, 'Lưu thành công')
			.then()
			.catch((err) => console.log(err))
			.finally(() => setLoadingXemSau(false));
	};

	const handleBoXemSau = (rec: any) => {
		setLoadingXemSau(true);
		deleteModel(rec?._id, getDataXemSau)
			.then()
			.catch((err) => console.log(err))
			.finally(() => setLoadingXemSau(false));
	};

	const columns: IColumn<VanBanHuongDan.IFile>[] = [
		{
			title: 'Tên văn bản',
			dataIndex: 'ten',
			filterType: 'string',
			width: 150,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Tệp đính kèm',
			dataIndex: 'url',
			render: (val) =>
				val ? (
					<>
						<PaperClipOutlined />{' '}
						<a href={val} target='_blank' rel='noreferrer'>
							Tệp đính kèm
						</a>
					</>
				) : null,
			width: 120,
		},
		{
			title: 'Lưu',
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<>
					{danhSachXemSau?.find((items) => items?.sourceId === rec?._id)?._id ? (
						<ButtonExtend
							loading={loadingXemSau}
							type='link'
							danger
							icon={<FileExcelOutlined />}
							tooltip='Bỏ lưu'
							onClick={() => handleBoXemSau(danhSachXemSau?.find((items) => items?.sourceId === rec?._id))}
						/>
					) : (
						<ButtonExtend
							className='text-success'
							loading={loadingXemSau}
							type='link'
							icon={<SaveOutlined />}
							tooltip='Lưu'
							onClick={() => handleXemSau(rec)}
						/>
					)}
				</>
			),
		},
	];

	return (
		<>
			{/* active bằng true là ẩn */}
			<TableStaticData
				columns={columns}
				data={record?.danhSachTep?.filter((item) => item?.active !== true) ?? []}
				hasTotal
				addStt
			/>
		</>
	);
};

export default FileList;
