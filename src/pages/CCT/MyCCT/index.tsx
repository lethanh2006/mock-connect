import CCTCover from '@/assets/cct/CCT_Bia.png';
import { FileTypeIcon, IconClock, IconRotateArrow, IconSave, IconSend, IconXmarkCircle } from '@/components/Icons';
import PageCard from '@/components/PageCard';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EStatusMyCCT } from '@/services/CCT/constant';
import { Button } from '@vinuni/ui';
import { Badge, Form, Space } from 'antd';
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
		<PageCard
			stickyHeader
			title={recDot?.roundName}
			subtitle={
				<span className='mycct-round-time'>
					<IconClock />
					{[recDot?.startDate, recDot?.endDate]
						.filter(Boolean)
						.map((date) => dayjs(date).format('DD/MM/YYYY, HH:mm'))
						.join(' - ')}
				</span>
			}
			extra={
				<Space wrap>
					{edit ? null : (
						<>
							{(() => {
								const isDisabled =
									record?.myCCT?.status === EStatusMyCCT.APPROVED ||
									record?.myCCT?.status === EStatusMyCCT.PENDING_APPROVAL;

								const isSubmitDisabled = !recDot?._id || isDisabled;

								return (
									<>
										<ButtonExtend size='large' icon={<IconRotateArrow style={{ fontSize: 28 }} />} onClick={getData} />

										<ButtonExtend
											size='large'
											disabled={loadingExport}
											icon={
												loadingExport ? (
													<IconRotateArrow className='anticon-spin' style={{ fontSize: 28 }} />
												) : (
													<FileTypeIcon type='pdf' size={28} />
												)
											}
											onClick={hanldeExport}
										/>

										{danhSach?.length ? (
											<Badge count={danhSach?.length} offset={[-3, 7]}>
												<Button
													size='lg'
													variant='outline'
													style={{ color: APP_CONFIG_PRIMARY_COLOR }}
													onClick={() => setVisiblePending(true)}
												>
													Pending For Approval
												</Button>
											</Badge>
										) : null}

										<Button variant='outline' size='lg' disabled={isDisabled} onClick={() => setEdit(true)}>
											Update
										</Button>

										<Button
											size='lg'
											disabled={isSubmitDisabled}
											title={
												!recDot?._id
													? 'No submission period available. Students can only submit during an active period.'
													: ''
											}
											onClick={() => {
												form
													.validateFields()
													.then((values) => {
														setPreviewData(values);
														setPreviewVisible(true);
													})
													.catch(() => {});
											}}
										>
											Submit
										</Button>
									</>
								);
							})()}
						</>
					)}
				</Space>
			}
		>
			<Form form={form} layout='vertical' onFinish={(values) => onFinish(values, isSubmit)}>
				<div style={{ maxWidth: '100%', margin: 'auto' }}>
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
								variant='outline'
								onClick={() => {
									setEdit(false);
								}}
								icon={<IconXmarkCircle />}
							>
								Cancel
							</Button>
							<Button
								type='submit'
								variant='outline'
								loading={formSubmiting}
								icon={<IconSave />}
								onClick={() => setIsSubmit(false)}
							>
								Save
							</Button>
							<Button
								variant='default'
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
		</PageCard>
	);
};

export default MyCCT;
