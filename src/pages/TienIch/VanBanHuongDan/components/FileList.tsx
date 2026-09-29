import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type VanBanHuongDan } from '@/services/TienIch/VanBanHuongDan/typing';
import { ELoaiThongTinXemSau } from '@/services/TienIch/XemSau/constant';
import { IconFile, IconPaperClip45Degree, IconSave } from '@/components/Icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FileList = () => {
	const intl = useIntl();
	const { record } = useModel('tienich.vanbanhuongdan');
	const {
		postModel: postXemSau,
		getAllModel: getAllXemSau,
		danhSach: danhSachXemSau,
		deleteModel,
	} = useModel('tienich.xemsau');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [loadingXemSau, setLoadingXemSau] = useState<boolean>(false);
	const [url, setUrl] = useState<string>();
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const getDataXemSau = () => {
		getAllXemSau(undefined, undefined, { loaiThongTin: ELoaiThongTinXemSau.VBHD }, undefined, 'me/many');
	};

	useEffect(() => {
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
			title: intl.formatMessage({ id: 'vanbanhuongdan.form.tenvanban' }),
			dataIndex: 'ten',
			filterType: 'string',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'vanbanhuongdan.form.mota' }),
			dataIndex: 'moTa',
			width: 250,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'vanbanhuongdan.form.tep' }),
			dataIndex: 'url',
			render: (val, rec) =>
				val ? (
					<>
						<IconPaperClip45Degree />{' '}
						<a
							onClick={() => {
								setUrl(val);
								setVisibleFormFile(true);
							}}
						>
							{intl.formatMessage({ id: 'vanbanhuongdan.form.tep' })}
						</a>
					</>
				) : null,
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'vanbanhuongdan.form.save' }),
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<>
					{danhSachXemSau?.find((items) => items?.sourceId === rec?._id)?._id ? (
						<ButtonExtend
							loading={loadingXemSau}
							type='link'
							danger
							icon={<IconFile />}
							tooltip={intl.formatMessage({ id: 'vanbanhuongdan.form.unsave' })}
							onClick={() => handleBoXemSau(danhSachXemSau?.find((items) => items?.sourceId === rec?._id))}
						/>
					) : (
						<ButtonExtend
							className='text-success'
							loading={loadingXemSau}
							type='link'
							icon={<IconSave />}
							tooltip={intl.formatMessage({ id: 'vanbanhuongdan.form.save' })}
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

			<ModalExpandable
				title={intl.formatMessage({ id: 'vanbanhuongdan.form.chitiet' })}
				width={1000}
				open={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>
							{intl.formatMessage({ id: 'global.button.dong' })}
						</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={url ?? ''} />
			</ModalExpandable>
		</>
	);
};

export default FileList;
