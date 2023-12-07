import { useModel, history } from 'umi';
import { getDonByUserId } from '@/services/KhaiBaoQuyTrinh/khaibaoquytrinh';
import { useEffect, useState } from 'react';
import FormQuyTrinh from '@/pages/KhaiBaoQuyTrinh/ViewQuyTrinh/components/Form';
import View from '@/pages/KhaiBaoQuyTrinh/ViewQuyTrinh/components/View';

const QuyTrinhView = ({
	match: {
		params: { id },
	},
}: {
	match: { params: { id: string } };
}) => {
	const { current, setCurrent, setDataQuyTrinh, dataQuyTrinh, setCurrentFormKhaiBao } =
		useModel('quytrinh.khaibaoquytrinh');
	const [loadingForm, setLoadingForm] = useState<boolean>(false);
	const { query = {} } = history.location;
	const { quyTrinh } = query;
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
		getData(id);
	}, [id]);
	return (
		<>
			{dataQuyTrinh && current && (
				<View
					dataQuyTrinh={dataQuyTrinh}
					current={current}
					loadingForm={loadingForm}
					modalName={'quytrinh.khaibaoquytrinh'}
					FormModal={() => {
						return <FormQuyTrinh idQuyTrinh={quyTrinh as string} getData={() => getData(id)} />;
					}}
				/>
			)}
		</>
	);
};
export default QuyTrinhView;
