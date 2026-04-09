import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EStatusMyCCT } from '@/services/CCT/constant';
import { handleSingleFile } from '@/services/uploadFile';
import { ipCCT } from '@/utils/ip';
import {
	CloseCircleOutlined,
	FilePdfOutlined,
	LoadingOutlined,
	ReloadOutlined,
	SaveOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { Badge, Button, Form, Space, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useRef, useState } from 'react';
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
	const [previewData, setPreviewData] = useState<any>();
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
					resolve(canvas.toDataURL('image/jpeg', 0.9));
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
            .export-mode { padding: 0 !important; margin: 0 !important; }
            .export-mode .skills-section h3::before {
                left: 0px !important;
                top: 10px !important;
                transform: translateY(-50%) !important;
            }
			.export-mode * {
        		font-weight: bold !important;
				font-size: 20px !important;
    		}
        `;
			document.head.appendChild(style);

			// ✅ Dùng đúng kích thước A3 landscape (px ở 96dpi): 1587 x 1123
			// Nhưng để capture sắc nét, set width = 3174 (x2) rồi scale html2canvas x2
			const A3_WIDTH_PX = 4000;
			clone.style.width = `${A3_WIDTH_PX}px`;
			clone.style.position = 'fixed';
			clone.style.top = '-9999px';
			clone.style.left = '0';
			clone.style.background = '#fff';

			document.body.appendChild(clone);

			// Xử lý icon-white
			const imgs = clone.querySelectorAll('.icon-white');
			await Promise.all(
				Array.from(imgs).map((img: any) => {
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
				}),
			);

			const canvas = await html2canvas(clone, {
				scale: 4,
				useCORS: true,
				backgroundColor: '#ffffff',
				logging: false,
				width: A3_WIDTH_PX,
				imageTimeout: 0,
				allowTaint: false,
			});

			document.body.removeChild(clone);
			document.head.removeChild(style);

			const mainImg = canvas.toDataURL('image/jpeg', 0.95);

			const headerImg = await loadImage('/student/images/cct/headerCCT.jpg');
			const footerImg = await loadImage('/student/images/cct/footerCCT.jpg');

			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'px',
				format: 'a3',
				compress: true,
			});

			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();

			// Trang 1: Header (A4 portrait)
			if (headerImg) {
				pdf.deletePage(1);
				pdf.addPage('a4', 'portrait');
				pdf.addImage(headerImg, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
				pdf.addPage('a3', 'landscape');
			}

			// ✅ Trang 2: Fill toàn bộ trang A3, padding 16
			const margin = 16;
			pdf.addImage(mainImg, 'JPEG', margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, undefined, 'FAST');

			// Trang 3: Footer (A4 portrait)
			if (footerImg) {
				pdf.addPage('a4', 'portrait');
				pdf.addImage(footerImg, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
			}

			pdf.save(`CCT_Transcript_${dayjs().format('YYYYMMDD')}.pdf`);
		} catch (error) {
			console.error('Export PDF error:', error);
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
								<i>
									No submission period available. <br />
									Students can only submit during an active period.
								</i>
							)}
						</div>
						<Space wrap>
							{edit ? null : (
								<>
									{(() => {
										const tagStyle = {
											padding: '6px 10px',
											marginTop: 12,
											fontSize: 14,
											fontWeight: 500,
											borderRadius: 4,
											display: 'inline-flex',
											alignItems: 'center' as const,
											gap: 4,
										};

										const disabledStyle = {
											cursor: 'not-allowed',
											opacity: 0.5,
										};

										const isDisabled =
											record?.myCCT?.status === EStatusMyCCT.APPROVED ||
											record?.myCCT?.status === EStatusMyCCT.PENDING_APPROVAL;

										const isSubmitDisabled = !recDot?._id || isDisabled;

										return (
											<>
												<Tooltip title='RELOAD'>
													<Tag
														icon={<ReloadOutlined style={{ fontSize: 14 }} />}
														style={{
															...tagStyle,
															cursor: 'pointer',
															display: 'inline-flex',
															alignItems: 'center',
															justifyContent: 'center',
															width: 32,
															height: 32,
															padding: 0,
														}}
														onClick={getData}
													/>
												</Tooltip>

												<Tag
													icon={
														exporting ? (
															<LoadingOutlined spin style={{ fontSize: 14 }} />
														) : (
															<FilePdfOutlined style={{ fontSize: 14 }} />
														)
													}
													style={{
														...tagStyle,
														cursor: 'pointer',
														display: 'inline-flex',
														alignItems: 'center',
														justifyContent: 'center',
														width: 32,
														height: 32,
														padding: 0,
														opacity: exporting ? 0.7 : 1,
													}}
													onClick={!exporting ? handleExportPDF : undefined}
												/>

												{danhSach?.length ? (
													<Badge count={danhSach?.length} offset={[-3, 7]}>
														<Tag
															style={{
																...tagStyle,
																cursor: 'pointer',
																animation: 'pulseSmooth 1.8s ease-in-out infinite',
																backgroundColor: '#FFE58F',
																color: '#CE7C1E',
																fontWeight: 600,
															}}
															onClick={() => setVisiblePending(true)}
														>
															PENDING FOR APPROVAL
														</Tag>
													</Badge>
												) : null}

												<Tag
													style={{
														...tagStyle,
														...(isDisabled ? disabledStyle : { cursor: 'pointer', color: '#134D8B', fontWeight: 600 }),
													}}
													onClick={() => {
														if (!isDisabled) {
															setEdit(true);
														}
													}}
												>
													UPDATE
												</Tag>

												<Tooltip
													title={
														!recDot?._id
															? 'No submission period available. Students can only submit during an active period.'
															: ''
													}
												>
													<Tag
														style={{
															...tagStyle,
															...(isSubmitDisabled
																? disabledStyle
																: { cursor: 'pointer', backgroundColor: '#F5FFEB', color: '#329323', fontWeight: 600 }),
														}}
														onClick={() => {
															if (!isSubmitDisabled) {
																form
																	.validateFields()
																	.then((values) => {
																		setPreviewData(values);
																		setPreviewVisible(true);
																	})
																	.catch(() => {});
															}
														}}
													>
														SUBMIT
													</Tag>
												</Tooltip>
											</>
										);
									})()}
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
							<Button
								onClick={() => {
									setEdit(false);

									setListAwardRecognition(record?.myCCT?.listAwardRecognition || []);
									setSelectedActivities([]);
								}}
								icon={<CloseCircleOutlined />}
							>
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
							<Button
								type='primary'
								icon={<SendOutlined />}
								onClick={() => {
									form
										.validateFields()
										.then((values) => {
											setPreviewData(values);
											setPreviewVisible(true);
										})
										.catch(() => {});
								}}
								disabled={
									!recDot?._id ||
									record?.myCCT?.status === EStatusMyCCT.APPROVED ||
									record?.myCCT?.status === EStatusMyCCT.PENDING_APPROVAL
								}
							>
								Submit
							</Button>
						</Space>
					</div>
				)}
			</Form>

			<PreviewCCTModal open={previewVisible} onCancel={() => setPreviewVisible(false)} onConfirm={handleRealSubmit}>
				<CCTContent
					record={
						previewData
							? {
									...record,
									myCCT: {
										...record?.myCCT,
										...previewData,
									},
								}
							: (record as any)
					}
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
