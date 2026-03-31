import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EStatusMyCCT } from '@/services/CCT/constant';
import { handleSingleFile } from '@/services/uploadFile';
import {
	CloseCircleOutlined,
	EditOutlined,
	FilePdfOutlined,
	ReloadOutlined,
	SaveOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { Button, Form, Space } from 'antd';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import CardNoteMyCCT from './components/CardNote';
import CCTContent from './components/CCTContent';
import PreviewCCTModal from './components/PreviewCCTModal';
import './style.less';

const uploadFilesOfCompetency = async (files: any[] = []) => {
	if (!files.length) return [];
	const urls = await Promise.all(files.map((f) => handleSingleFile(f).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const MyCCTv3 = () => {
	const [form] = Form.useForm();
	const { getByIdModel, updateMyCCTModel, formSubmiting, edit, setEdit } = useModel('cct.mycct');
	const { getByIdModel: getDot, record: recDot } = useModel('cct.submissionround');
	const [selectedActivities, setSelectedActivities] = useState<{ attributeId: string; activityIds: string[] }[]>([]);
	const [record, setRecord] = useState<{
		allCompetencies: string[];
		attributes: MyCCT.IAttributeMyCCT[];
		levelOfEngagement: MyCCT.ILevelOfEngagement[];
		myCCT: MyCCT.IRecord;
		awardsAndRecognition: ActivityOutCome.IRecord;
	}>();
	const [isSubmit, setIsSubmit] = useState<boolean>(false);
	const printRef = useRef<HTMLDivElement>(null);
	const [previewVisible, setPreviewVisible] = useState<boolean>(false);
	const [listAwardRecognition, setListAwardRecognition] = useState<string[]>([]);
	const [exporting, setExporting] = useState(false); // State để quản lý loading khi xuất file

	const getData = () => {
		getByIdModel('me', false).then((res: any) => {
			if (res?.myCCT?.selectedActivities?.length) {
				res.attributes = res?.attributes?.map((attr: any) => {
					const found = res?.myCCT?.selectedActivities?.find((i: any) => i?.attributeId === attr?.attribute?._id);

					if (!found) return attr;

					const mapOrder = new Map(found?.activityIds?.map((id: string, index: number) => [id, index]));

					attr.activitiesOutCome = [...(attr?.activitiesOutCome || [])].sort(
						(a, b) => (mapOrder.get(a.id) ?? (999 as any)) - (mapOrder.get(b.id) ?? (999 as any)),
					);

					return attr;
				});
			}

			if (res?.myCCT?.listAwardRecognition?.length) {
				const mapOrder = new Map(res.myCCT.listAwardRecognition.map((id: string, index: number) => [id, index]));

				res.awardsAndRecognition = [...(res.awardsAndRecognition || [])].sort(
					(a, b) => (mapOrder.get(a.id) ?? (999 as any)) - (mapOrder.get(b.id) ?? (999 as any)),
				);
			}

			setRecord(res);
		});
	};

	const getDotHienHanh = () => {
		getDot('active', true);
	};

	useEffect(() => {
		getData();
		getDotHienHanh();
	}, []);

	useEffect(() => {
		if (!edit) {
			form.resetFields();
		} else {
			form.setFieldsValue(record?.myCCT);

			if (record?.myCCT?.listAwardRecognition?.length) {
				setListAwardRecognition(record.myCCT.listAwardRecognition);
			}
		}
	}, [edit, record?.myCCT?._id]);

	const onFinish = async (values: MyCCT.IRecord, submitted: boolean) => {
		const awardsAndRecognition = await Promise.all(
			(values?.awardsAndRecognition || []).map(async (award: any) => ({
				...award,
				evidenceFile: await Promise.all(
					(award.evidenceFile || [])?.map(async (file: any) => ({
						name: file.name,
						file: await uploadFilesOfCompetency(file?.file?.fileList),
					})),
				),
			})),
		);

		const fallbackSelected = record?.attributes?.map((attr) => ({
			attributeId: attr?.attribute?._id,
			activityIds: (attr?.activitiesOutCome || []).map((i) => i.id),
		}));

		const data = {
			...values,
			awardsAndRecognition,
			selectedActivities: selectedActivities.length ? selectedActivities : fallbackSelected,
			listAwardRecognition,
			submitted,
		};

		updateMyCCTModel(data as any, getData)
			.then(() => setEdit(false))
			.catch((err) => console.log(err));
	};

	const handleRealSubmit = () => {
		form
			.validateFields()
			.then((values) => {
				onFinish(values, true);
				setPreviewVisible(false);
			})
			.catch(() => {});
	};

	// const handlePrint = useReactToPrint({
	// 	contentRef: printRef,
	// 	documentTitle: 'CCT Transcript',
	// 	copyStyles: true,
	// } as any);

	const handleExportPDF = async () => {
		const element = printRef.current;
		if (!element) return;

		try {
			setExporting(true);

			const clone = element.cloneNode(true) as HTMLElement;

			// ✅ add class riêng
			clone.classList.add('export-mode');

			// ✅ inject style override pseudo-element
			const style = document.createElement('style');
			style.innerHTML = `
			.export-mode .skills-section h3::before {
				left: 0px !important;
				top: 10px !important;
				transform: translateY(-50%) !important;
			}
		`;
			document.head.appendChild(style);

			clone.style.width = '1700px';
			clone.style.position = 'fixed';
			clone.style.top = '-9999px';
			clone.style.left = '0';
			clone.style.zIndex = '-1';
			clone.style.background = '#fff';

			document.body.appendChild(clone);

			const canvas = await html2canvas(clone, {
				scale: 2,
				useCORS: true,
			});

			document.body.removeChild(clone);
			document.head.removeChild(style); // ✅ cleanup

			const imgData = canvas.toDataURL('image/png');

			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'px',
				format: 'a3',
			});

			const imgProps = pdf.getImageProperties(imgData);

			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);

			const finalWidth = imgProps.width * ratio;
			const finalHeight = imgProps.height * ratio;

			const offsetX = (pdfWidth - finalWidth) / 2;
			const offsetY = (pdfHeight - finalHeight) / 2;

			pdf.addImage(imgData, 'PNG', offsetX, offsetY, finalWidth, finalHeight);

			pdf.save(`CCT_Transcript_${dayjs().format('YYYYMMDD')}.pdf`);
		} catch (error) {
			console.error(error);
		} finally {
			setExporting(false);
		}
	};

	return (
		<>
			<Form form={form} layout='vertical' onFinish={(values) => onFinish(values, isSubmit)}>
				<div
					style={{
						maxWidth: '100%',
						margin: 'auto',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<div style={{ color: '#fff', textAlign: 'left' }}>
							{recDot?._id ? (
								<>
									<strong>{recDot?.roundName}</strong>
									<p>{`(${[
										dayjs(recDot?.startDate).format('HH:mm DD/MM/YYYY'),
										dayjs(recDot?.endDate).format('HH:mm DD/MM/YYYY'),
									]
										.filter(Boolean)
										.join(' - ')})`}</p>
								</>
							) : (
								<></>
							)}
						</div>
						<Space wrap>
							{edit ? (
								<>
									<Button onClick={() => setEdit(false)} icon={<CloseCircleOutlined />}>
										Cancel
									</Button>
									<Button
										htmlType='submit'
										loading={formSubmiting}
										icon={<SaveOutlined />}
										onClick={() => setIsSubmit(false)}
									>
										Save
									</Button>
									<Button icon={<SendOutlined />} onClick={() => setPreviewVisible(true)}>
										Submit
									</Button>
								</>
							) : (
								<>
									<Button onClick={getData} icon={<ReloadOutlined />}>
										Reload
									</Button>
									{/* <Button icon={<PrinterOutlined />} onClick={handlePrint as any}>
										Print
									</Button> */}
									<Button icon={<FilePdfOutlined />} onClick={handleExportPDF} loading={exporting}>
										Export PDF
									</Button>
									<Button
										disabled={
											record?.myCCT?.status === EStatusMyCCT.APPROVED ||
											record?.myCCT?.status === EStatusMyCCT.PENDING_APPROVAL
										}
										onClick={() => {
											setEdit(true);
										}}
										icon={<EditOutlined />}
									>
										Update
									</Button>
									<Button
										disabled={
											record?.myCCT?.status === EStatusMyCCT.APPROVED ||
											record?.myCCT?.status === EStatusMyCCT.PENDING_APPROVAL
										}
										icon={<SendOutlined />}
										onClick={() => setPreviewVisible(true)}
									>
										Submit
									</Button>
								</>
							)}
						</Space>
					</div>
					{!!record?.myCCT?.status && <CardNoteMyCCT myCCT={record?.myCCT ?? ({} as MyCCT.IRecord)} />}
				</div>

				<div className='cct-container' ref={printRef}>
					<CCTContent
						record={record as any}
						form={form}
						setSelectedActivities={setSelectedActivities}
						setListAwardRecognition={setListAwardRecognition}
						edit={edit}
					/>
				</div>

				{edit && (
					<div
						style={{
							position: 'fixed',
							bottom: 0,
							left: 0,
							width: '100%',
							background: '#fff',
							padding: '12px 16px',
							boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
							zIndex: 1000,
							display: 'flex',
							justifyContent: 'flex-end',
						}}
					>
						<Space wrap>
							<Button onClick={() => setEdit(false)} icon={<CloseCircleOutlined />}>
								Cancel
							</Button>
							<Button
								htmlType='submit'
								loading={formSubmiting}
								icon={<SaveOutlined />}
								onClick={() => setIsSubmit(false)}
							>
								Save
							</Button>
							<Button type='primary' icon={<SendOutlined />} onClick={() => setPreviewVisible(true)}>
								Submit
							</Button>
						</Space>
					</div>
				)}
			</Form>

			<PreviewCCTModal open={previewVisible} onCancel={() => setPreviewVisible(false)} onConfirm={handleRealSubmit}>
				<CCTContent
					record={record as any}
					form={form}
					setSelectedActivities={setSelectedActivities}
					setListAwardRecognition={setListAwardRecognition}
					edit={false}
				/>
			</PreviewCCTModal>
		</>
	);
};

export default MyCCTv3;
