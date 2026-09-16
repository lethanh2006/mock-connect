import EmptyState from '@/components/EmptyState';
import { Button, IconDownload } from '@/components/Icons';
import { Spin } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalExpandable from '../ModalExpandable';
import { type TExportField } from '../typing';
import CardChooseFields from './CardChooseFields';
import CardExportFields from './CardExportFields';
import './style.less';
import { ModalExportProps } from './typing';

const ModalExport = (props: ModalExportProps) => {
	const intl = useIntl();
	const { visible, onCancel, modelName, maskCloseableForm, fileName, condition, filters, otherQuery } = props;
	const { getExportFieldsModel, postExportModel, formSubmiting, selectedIds } = useModel(modelName) as any;
	const [allFields, setAllFields] = useState<TExportField[]>([]); // Export Fields lấy từ API
	const [exportFields, setExportFields] = useState<TExportField[]>([]);
	const [isGetFields, setIsGetFields] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const finalFields = exportFields.filter((item) => item.selected);

	const genFlatData = (data?: TExportField[], disableImport?: boolean): TExportField[] => {
		if (!data?.length) return [];
		// Nếu có field con thì populate hết các field con,
		// còn ko thì trả về chính nó
		// MẶC ĐỊNH chọn những trường KHÔNG disableImport và cha của nó cũng không disableImport
		return data
			.map((item) =>
				!item.children
					? [{ ...item, selected: !disableImport && !item.disableImport }]
					: genFlatData(item.children, item.disableImport || disableImport),
			)
			.flat();
	};

	const getFields = async () => {
		setLoading(true);
		try {
			if (getExportFieldsModel)
				await getExportFieldsModel(otherQuery).then((fields: TExportField[]) => {
					setAllFields(fields);

					const flatData = genFlatData(fields);
					setExportFields(flatData);
					setIsGetFields(true);
				});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setIsGetFields(false);
	}, [modelName]);

	useEffect(() => {
		if (visible && !isGetFields) {
			getFields();
		}
	}, [visible]);

	const onCancelModal = () => onCancel();

	const onFinish = () => {
		if (finalFields.length)
			postExportModel(
				// selectedIds?.length > 0 ? { ids: selectedIds, definitions: finalFields } :
				{ definitions: finalFields },
				condition,
				filters,
				otherQuery,
			).then((blob: Blob) => {
				fileDownload(blob, fileName);
				onCancel();
			});
	};

	return (
		<ModalExpandable
			open={visible}
			onCancel={onCancelModal}
			title={intl.formatMessage({ id: 'global.table.export.title' })}
			width={800}
			allowExpand={false}
			maskClosable={maskCloseableForm}
		>
			<div>
				{loading ? (
					<div className='export-modal-loading'>
						<Spin />
					</div>
				) : !!exportFields.length ? (
					<>
						<div className='export-modal-fields-label'>
							{intl.formatMessage({ id: 'global.table.export.index.choncactruong' })}:
						</div>

						<div className='export-modal-fields-grid'>
							<CardChooseFields allFields={allFields} fields={exportFields} setFields={setExportFields} />
							<CardExportFields fields={exportFields} setFields={setExportFields} />
						</div>

						<div className='form-footer'>
							<Button
								variant='default'
								icon={<IconDownload />}
								onClick={onFinish}
								disabled={!finalFields.length}
								loading={formSubmiting}
							>
								{intl.formatMessage({ id: 'global.table.export.index.button.taixuong' })}
							</Button>
							<Button variant='outline' onClick={onCancelModal}>
								{intl.formatMessage({ id: 'global.table.export.index.button.huy' })}
							</Button>
						</div>
					</>
				) : (
					<EmptyState description={intl.formatMessage({ id: 'global.table.export.index.empty' })} />
				)}
			</div>
		</ModalExpandable>
	);
};

export default ModalExport;
