import FormQuyTrinh from '@/pages/KhaiBaoQuyTrinh/ViewQuyTrinh/components/Form';
import View from '@/pages/KhaiBaoQuyTrinh/ViewQuyTrinh/components/View';
import { ELoaiDanhMucChung } from '@/services/QuyTrinh/DanhMuc/constants';
import { getDonByUserId } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';
import { useSearchParams } from '@umijs/max';
import { useEffect, useState } from 'react';
import { useModel, useParams } from 'umi';

const QuyTrinhView = () => {
	const [searchParams] = useSearchParams();
	const { current, setCurrent, setDataQuyTrinh, dataQuyTrinh, setCurrentFormKhaiBao, setEditFormKhaiBao } =
		useModel('quytrinh.khaibaoquytrinh');
	const { getAllModel: getAllDanhMucChung } = useModel('quytrinh.danhmuc');
	const [loadingForm, setLoadingForm] = useState<boolean>(false);
	const { id } = useParams<{ id: string }>();

	const quyTrinh = searchParams.get('quyTrinh');
	const getData = async (ids: string) => {
		try {
			setLoadingForm(true);
			const res = await getDonByUserId(ids);

			if (res) {
				setDataQuyTrinh(res?.data?.data);
				//set data buoc hien tai la buoc cuoi cung
				setCurrent(res?.data?.data?.danhSachBuocXuLy?.[res?.data?.data?.danhSachBuocXuLy?.length - 1]);
				const arr = res?.data?.data?.quyTrinh?.danhSachFormKhaiBao;
				const obj = arr?.find(
					(item: { ma: any }) => item?.ma === res?.data?.data?.danhSachBuocXuLy?.[0]?.maFormKhaiBao,
				);

				setCurrentFormKhaiBao(obj);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingForm(false);
		}
	};

	useEffect(() => {
		if (id) {
			getData(id);
			getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH }, undefined, `user/many/don/${id}`);
		}
	}, [id]);

	useEffect(() => {
		return () => {
			setEditFormKhaiBao(false);
		};
	}, []);

	return (
		<>
			{dataQuyTrinh && current && (
				<View
					dataQuyTrinh={dataQuyTrinh}
					current={current}
					loadingForm={loadingForm}
					modalName={'quytrinh.khaibaoquytrinh'}
					FormModal={() => {
						return <FormQuyTrinh idQuyTrinh={quyTrinh as string} getData={() => id && getData(id)} />;
					}}
				/>
			)}
		</>
	);
};
export default QuyTrinhView;
