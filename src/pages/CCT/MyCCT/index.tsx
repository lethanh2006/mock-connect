import CCTCover from '@/assets/cct/CCT_Bia.png';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EStatusMyCCT } from '@/services/CCT/constant';
import { IconXmarkCircle, IconFile, IconRotateArrow, IconSave, IconSend } from '@/components/Icons';
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

const loadImage = (src: string) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = src;
	});

const MyCCT = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getByIdModel, updateMyCCTModel, formSubmiting, edit, setEdit } = useModel('cct.mycct');
	const { getByIdModel: getDot, record: recDot } = useModel('cct.submissionround');
	const { getAllModel, danhSach } = useModel('cct.activityoutcome');
	const [record, setRecord] = useState<{
		activities: MyCCT.IActivityMyCCT[];
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
	const [loadingExport, setLoadingExport] = useState<boolean>(false);
	const [visiblePending, setVisiblePending] = useState<boolean>(false);

	const getExportFilename = () => {
		const name = record?.myCCT?.code || record?.myCCT?.name || dayjs().format('YYYYMMDD_HHmm');

		return `My_CCT_${name}`.replace(/[\\/:*?"<>|]/g, '_');
	};

	const getData = () => {
		getByIdModel('me', false).then((res: any) => {
			// if (res?.myCCT?.listAwardRecognition?.length) {
			// 	const mapOrder = new Map(res.myCCT.listAwardRecognition.map((id: string, index: number) => [id, index]));

			// 	res.awardsAndRecognition = [...(res.awardsAndRecognition || [])].sort(
			// 		(a, b) => (mapOrder.get(a.id) ?? (999 as any)) - (mapOrder.get(b.id) ?? (999 as any)),
			// 	);
			// }

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
		}
	}, [edit, record?.myCCT?._id]);

	const onFinish = async (values: MyCCT.IRecord, submitted: boolean) => {
		const data = {
			...values,
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

	const hanldeExport = async () => {
		if (!printRef.current) {
			return;
		}

		setLoadingExport(true);

		try {
			const exportNode = printRef.current;
			const exportWidth = 1587;
			const exportHeight = 1123;

			await document.fonts.ready;

			const canvas = await html2canvas(exportNode, {
				backgroundColor: '#ffffff',
				scale: 3,
				useCORS: true,
				width: exportWidth,
				height: exportHeight,
				windowWidth: exportWidth,
				windowHeight: exportHeight,
				onclone: (clonedDocument) => {
					const clonedExportArea = clonedDocument.querySelector<HTMLElement>('.cct-export-area');
					const clonedTitle = clonedDocument.querySelector<HTMLElement>('.header-title');

					clonedExportArea?.classList.add('exporting-pdf');

					if (clonedTitle) {
						clonedTitle.style.background = 'none';
						clonedTitle.style.color = '#f4dab2';
						clonedTitle.style.webkitTextFillColor = '#f4dab2';
					}
				},
			});
			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'mm',
				format: 'a3',
			});
			const pageWidth = 420;
			const pageHeight = 297;
			const coverImage = await loadImage(CCTCover);

			pdf.addImage(coverImage, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
			pdf.addPage('a3', 'landscape');
			pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
			pdf.save(`${getExportFilename()}.pdf`);
		} catch (er) {
			console.log(er);
		} finally {
			setLoadingExport(false);
		}
	};

	return (
		<>
			<Form form={form} layout='vertical' onFinish={(values) => onFinish(values, isSubmit)}>
				<div style={{ maxWidth: '100%', margin: 'auto' }}>
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
														icon={<IconRotateArrow style={{ fontSize: 14 }} />}
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
														loadingExport ? (
															<IconRotateArrow className='anticon-spin' style={{ fontSize: 14 }} />
														) : (
															<IconFile style={{ fontSize: 14 }} />
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
														opacity: loadingExport ? 0.7 : 1,
													}}
													onClick={!loadingExport ? hanldeExport : undefined}
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

				<div className='cct-export-area' ref={printRef}>
					<CCTContent record={record as any} form={form} edit={edit} />
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
								}}
								icon={<IconXmarkCircle />}
							>
								Cancel
							</Button>
							<Button
								htmlType='submit'
								loading={formSubmiting}
								icon={<IconSave />}
								onClick={() => setIsSubmit(false)}
							>
								Save
							</Button>
							<Button
								type='primary'
								icon={<IconSend />}
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
					edit={false}
				/>
			</PreviewCCTModal>

			<ModalPeding
				visible={visiblePending}
				setVisible={setVisiblePending}
				getData={() => getAllModel(undefined, undefined, undefined, undefined, 'pending-for-approval/many')}
			/>
		</>
	);
};

export default MyCCT;
