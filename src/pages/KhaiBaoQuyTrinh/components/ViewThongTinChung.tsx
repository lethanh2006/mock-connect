import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { useEffect, useState } from 'react';
import { Descriptions } from 'antd';

const ViewThongTinChung = (props: { dataThongTinChung: QuyTrinh.IDanhSachCauHinhThongTinChung[] }) => {
	const [dataBasic, setDatabasic] = useState<QuyTrinh.IDanhSachCauHinhThongTinChung[]>([]);
	const [dataHtml, setDataHtml] = useState<QuyTrinh.IDanhSachCauHinhThongTinChung[]>([]);
	useEffect(() => {
		if (props?.dataThongTinChung) {
			const arrBasic = [...dataBasic];
			const arrHtml = [...dataHtml];
			props?.dataThongTinChung?.forEach((val) => {
				if (val?.html) {
					arrHtml.push({ ...val });
				} else {
					arrBasic.push({ ...val });
				}
			});
			setDatabasic(arrBasic);
			setDataHtml(arrHtml);
		}
	}, [props?.dataThongTinChung]);
	return (
		<>
			<div>
				{props?.dataThongTinChung?.length > 0 && (
					<>
						{props?.dataThongTinChung?.map((val) => {
							return (
								<>
									<div style={{ fontWeight: 'bold' }}>{val?.ten}</div>
									<div dangerouslySetInnerHTML={{ __html: val?.noiDung }} />
								</>
							);
						})}
					</>
				)}
			</div>
		</>
	);
};
export default ViewThongTinChung;
