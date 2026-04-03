import ButtonExtend from '@/components/Table/ButtonExtend';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EStatusMyCCT } from '@/services/CCT/constant';
import { handleSingleFile } from '@/services/uploadFile';
import { ipCCT } from '@/utils/ip';
import {
	CloseCircleOutlined,
	EditOutlined,
	FilePdfOutlined,
	ReloadOutlined,
	SaveOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { Badge, Button, Form, Space } from 'antd';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl, useModel } from 'umi';
import CardNoteMyCCT from './components/CardNote';
import CCTContent from './components/CCTContent';
import ModalPeding from './components/ModalPeding';
import PreviewCCTModal from './components/PreviewCCTModal';
import './style.less';

const uploadFilesOfCompetency = async (files: any[] = []) => {
	if (!files.length) return [];
	const urls = await Promise.all(files.map((f) => handleSingleFile(f, undefined, ipCCT).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const MyCCTv3 = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getByIdModel, updateMyCCTModel, formSubmiting, edit, setEdit } = useModel('cct.mycct');
	const { getByIdModel: getDot, record: recDot } = useModel('cct.submissionround');
	const { getAllModel, danhSach } = useModel('cct.activityoutcome');
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
	const [exporting, setExporting] = useState(false);
	const [visiblePending, setVisiblePending] = useState<boolean>(false);

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
		getAllModel(undefined, undefined, undefined, undefined, 'pending-for-approval/many');
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

		updateMyCCTModel(data as any, getData, intl.formatMessage({ id: 'global.message.luuthanhcong' }))
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

	const handlePrint = useReactToPrint({
		contentRef: printRef,
		documentTitle: 'CCT Transcript',
		copyStyles: true,
	} as any);

	const handleExportPDF = async () => {
		const element = printRef.current;
		if (!element) return;

		const loadImage = (src: string): Promise<string> => {
			return new Promise((resolve) => {
				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.src = src;

				img.onload = () => {
					const canvas = document.createElement('canvas');
					canvas.width = img.width;
					canvas.height = img.height;
					const ctx = canvas.getContext('2d');
					if (!ctx) return resolve('');

					ctx.drawImage(img, 0, 0);
					resolve(canvas.toDataURL('image/jpeg', 0.8));
				};

				img.onerror = () => resolve('');
			});
		};

		try {
			setExporting(true);

			const clone = element.cloneNode(true) as HTMLElement;
			clone.classList.add('export-mode');

			const style = document.createElement('style');
			style.innerHTML = `
            .export-mode .skills-section h3::before {
                left: 0px !important;
                top: 10px !important;
                transform: translateY(-50%) !important;
            }
        `;
			document.head.appendChild(style);

			clone.style.width = '2200px';
			clone.style.position = 'fixed';
			clone.style.top = '-9999px';
			clone.style.left = '0';
			clone.style.zIndex = '-1';
			clone.style.background = '#fff';

			document.body.appendChild(clone);

			const convertImageToWhite = (img: HTMLImageElement) => {
				return new Promise<void>((resolve) => {
					const image = new Image();
					image.crossOrigin = 'anonymous';
					image.src = img.src;

					image.onload = () => {
						const canvas = document.createElement('canvas');
						const ctx = canvas.getContext('2d');
						if (!ctx) return resolve();

						canvas.width = image.width;
						canvas.height = image.height;
						ctx.drawImage(image, 0, 0);

						const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
						const data = imageData.data;

						for (let i = 0; i < data.length; i += 4) {
							data[i] = 255;
							data[i + 1] = 255;
							data[i + 2] = 255;
						}

						ctx.putImageData(imageData, 0, 0);
						img.src = canvas.toDataURL('image/png');
						resolve();
					};
					image.onerror = () => resolve();
				});
			};

			const imgs = clone.querySelectorAll('.icon-white');
			await Promise.all(Array.from(imgs).map((img: any) => convertImageToWhite(img)));

			const waitForImages = (container: HTMLElement) => {
				const images = container.querySelectorAll('img');
				return Promise.all(
					Array.from(images).map((img: any) => {
						if (img.complete) return Promise.resolve();
						return new Promise((res) => {
							img.onload = res;
							img.onerror = res;
						});
					}),
				);
			};

			await waitForImages(clone);

			const canvas = await html2canvas(clone, {
				scale: 2,
				useCORS: true,
				backgroundColor: '#ffffff',
				logging: false,
			});

			document.body.removeChild(clone);
			document.head.removeChild(style);

			const mainImgData = canvas.toDataURL('image/jpeg', 0.85);

			const headerImg = await loadImage('/student/images/cct/headerCCT.jpg');
			const footerImg = await loadImage('/student/images/cct/footerCCT.jpg');

			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'px',
				format: 'a3',
				compress: true,
			});

			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			const addImageCentered = (data: string, isNewPage = false) => {
				if (isNewPage) pdf.addPage();

				const props = pdf.getImageProperties(data);
				const ratio = Math.min(pdfWidth / props.width, pdfHeight / props.height);
				const w = props.width * ratio;
				const h = props.height * ratio;
				const x = (pdfWidth - w) / 2;
				const y = (pdfHeight - h) / 2;

				pdf.addImage(data, 'JPEG', x, y, w, h, undefined, 'FAST');
			};

			if (headerImg) {
				addImageCentered(headerImg, false);
			}

			addImageCentered(mainImgData, !!headerImg);

			if (footerImg) {
				addImageCentered(footerImg, true);
			}

			pdf.save(`CCT_Transcript_${dayjs().format('YYYYMMDD')}.pdf`);
		} catch (error) {
			console.error('Export PDF error:', error);
		} finally {
			setExporting(false);
		}
	};

	// const handleExportPDF = async () => {
	// 	const element = printRef.current;
	// 	if (!element) return;

	// 	try {
	// 		setExporting(true);

	// 		const clone = element.cloneNode(true) as HTMLElement;

	// 		clone.classList.add('export-mode');

	// 		const style = document.createElement('style');
	// 		style.innerHTML = `
	// 		.export-mode .skills-section h3::before {
	// 			left: 0px !important;
	// 			top: 10px !important;
	// 			transform: translateY(-50%) !important;
	// 		}
	// 	`;
	// 		document.head.appendChild(style);
	// 		clone.style.width = '2200px';
	// 		clone.style.position = 'fixed';
	// 		clone.style.top = '-9999px';
	// 		clone.style.left = '0';
	// 		clone.style.zIndex = '-1';
	// 		clone.style.background = '#fff';

	// 		document.body.appendChild(clone);

	// 		const canvas = await html2canvas(clone, {
	// 			scale: 2,
	// 			useCORS: true,
	// 		});

	// 		document.body.removeChild(clone);
	// 		document.head.removeChild(style);

	// 		const imgData = canvas.toDataURL('image/png');

	// 		const pdf = new jsPDF({
	// 			orientation: 'landscape',
	// 			unit: 'px',
	// 			format: 'a3',
	// 		});

	// 		const imgProps = pdf.getImageProperties(imgData);

	// 		const pdfWidth = pdf.internal.pageSize.getWidth();
	// 		const pdfHeight = pdf.internal.pageSize.getHeight();

	// 		const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);

	// 		const finalWidth = imgProps.width * ratio;
	// 		const finalHeight = imgProps.height * ratio;

	// 		const offsetX = (pdfWidth - finalWidth) / 2;
	// 		const offsetY = (pdfHeight - finalHeight) / 2;

	// 		pdf.addImage(imgData, 'PNG', offsetX, offsetY, finalWidth, finalHeight);

	// 		pdf.save(`CCT_Transcript_${dayjs().format('YYYYMMDD')}.pdf`);
	// 	} catch (error) {
	// 		console.error(error);
	// 	} finally {
	// 		setExporting(false);
	// 	}
	// };

	return (
		<>
			<Form form={form} layout='vertical' onFinish={(values) => onFinish(values, isSubmit)}>
				<div
					style={{
						maxWidth: '100%',
						margin: 'auto',
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							margin: !recDot?._id ? '12px 0px 12px 0px' : undefined,
						}}
					>
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
							{edit ? null : (
								<>
									{danhSach?.length ? (
										<Badge count={danhSach?.length} offset={[-3, 0]}>
											<ButtonExtend
												tooltip='Some activities are still pending approval. Please contact the approver.'
												style={{
													animation: 'pulseSmooth 1.8s ease-in-out infinite',
													backgroundColor: '#faad14',
												}}
												onClick={() => setVisiblePending(true)}
												size='small'
											>
												Pending For Approval
											</ButtonExtend>
										</Badge>
									) : null}

									<Button onClick={getData} icon={<ReloadOutlined />} size='small'>
										Reload
									</Button>
									{/* <Button icon={<PrinterOutlined />} onClick={handlePrint as any}>
											Print
										</Button> */}
									<Button icon={<FilePdfOutlined />} onClick={handleExportPDF} loading={exporting} size='small'>
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
										size='small'
									>
										Update
									</Button>
									<Button
										disabled={
											!recDot?._id ||
											record?.myCCT?.status === EStatusMyCCT.APPROVED ||
											record?.myCCT?.status === EStatusMyCCT.PENDING_APPROVAL
										}
										icon={<SendOutlined />}
										onClick={() => setPreviewVisible(true)}
										size='small'
										style={{
											backgroundColor:
												record?.myCCT?.status === EStatusMyCCT.APPROVED ||
												record?.myCCT?.status === EStatusMyCCT.PENDING_APPROVAL
													? undefined
													: '#52c41a',
										}}
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

			<ModalPeding visible={visiblePending} setVisible={setVisiblePending} />
		</>
	);
};

export default MyCCTv3;
