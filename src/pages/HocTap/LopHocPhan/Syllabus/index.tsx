import {
	colorTrangThaiDuyetGiaoAn,
	ETrangThaiDuyetGiaoAn,
	trangThaiDuyetGiaoAn,
} from '@/services/DanhMucHeThong/Syllabus/constant';
import { formatDateTime } from '@/utils/formatDate';
import { Button, Card, Descriptions, Form, Splitter, Steps, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl, useModel } from 'umi';
import SyllabusSectionsList from './sections/SyllabusSectionsList';
import './styles.less';

const { Title } = Typography;

interface Props {
	previewContentRef?: React.MutableRefObject<HTMLDivElement | null>;
	isLopTinChi?: boolean;
	footer?: React.ReactNode;
	mucLucCollapsed?: boolean;
	extra?: React.ReactNode;
}

const SyllabusPreview = ({ previewContentRef, isLopTinChi, footer, mucLucCollapsed = false, extra }: Props) => {
	const intl = useIntl();
	const internalRef = useRef<HTMLDivElement | null>(null);
	const contentRef = previewContentRef || internalRef;
	const [container, setContainer] = useState<HTMLElement | null>(null);
	const form = Form.useFormInstance();
	const [currentStep, setCurrentStep] = useState(0);

	const sections = Form.useWatch('noiDung', form) ?? [];
	const recordSyllabus = Form.useWatch('deCuong', form);
	const ngayTao = Form.useWatch('createdAt', form);
	const ngayCapNhat = Form.useWatch('updatedAt', form);
	const trangThaiDuyet = Form.useWatch('trangThaiDuyet', form);
	const nguoiTaoHoTen = Form.useWatch('nguoiTaoHoTen', form);
	useEffect(() => {
		if (!container) return;

		const handleScroll = () => {
			const sectionElements = sections.map((_: any, index: number) => {
				return container.querySelector(`#section-${index}`);
			});

			let current = 0;
			sectionElements.forEach((el: Element | null, i: number) => {
				if (el && (el as HTMLElement).offsetTop - container.offsetTop <= container.scrollTop + 70) {
					current = i;
				}
			});
			setCurrentStep(current);
		};

		container.addEventListener('scroll', handleScroll);
		return () => container.removeEventListener('scroll', handleScroll);
	}, [container, sections]);

	const handleStepChange = (current: number) => {
		setCurrentStep(current);
		container
			?.querySelector<HTMLElement>(`#section-${current}`)
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	return (
		<Form form={form} component={false}>
			<Form.Item name='noiDungCu' noStyle />
			<Form.Item name='deCuong' noStyle />
			<Form.Item name='idDeCuong' noStyle />
			<Form.Item name='nguoiTaoHoTen' noStyle />
			<Form.Item name='createdAt' noStyle />
			<Form.Item name='trangThaiDuyet' noStyle />
			<Form.Item name='updatedAt' noStyle />
			<Splitter key='toc-content' style={{ height: '68vh', background: 'transparent' }}>
				<Splitter.Panel
					collapsible={{ start: true }}
					size={mucLucCollapsed ? 0 : undefined}
					defaultSize='20%'
					min='20%'
					max='40%'
					style={{ background: 'transparent', transition: 'all 0.25s ease', overflow: 'hidden' }}
				>
					<div
						style={{
							overflowY: 'auto',
							height: '100%',
							display: mucLucCollapsed ? 'none' : 'block',
							minWidth: 150,
							padding: '0 12px',
						}}
					>
						{sections.length > 0 && (
							<div>
								<Title level={5}>{intl.formatMessage({ id: 'syllabus.preview.mucLuc' })}</Title>
								<Steps
									direction='vertical'
									size='small'
									current={currentStep}
									onChange={handleStepChange}
									items={sections.map((section: any) => ({ title: section.tieuDe }))}
								/>
							</div>
						)}
					</div>
				</Splitter.Panel>

				<Splitter.Panel
					defaultSize='60%'
					min='60%'
					max='80%'
					style={{
						display: 'flex',
						flexDirection: 'column',
						background: 'transparent',
						overflow: 'hidden',
					}}
				>
					<div style={{ paddingLeft: 16 }}>
						{recordSyllabus && (
							<Descriptions size='small' column={2} bordered style={{ marginBottom: 12 }}>
								<Descriptions.Item label={intl.formatMessage({ id: 'syllabus.list.colNguoiSoan' })}>
									{nguoiTaoHoTen}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'syllabus.list.colNgayTao' })}>
									{formatDateTime(ngayTao)}
								</Descriptions.Item>
								{trangThaiDuyet && (
									<Descriptions.Item
										label={intl.formatMessage({
											id: 'syllabus.list.colTrangThaiDuyet',
										})}
									>
										<Tag color={colorTrangThaiDuyetGiaoAn[trangThaiDuyet as ETrangThaiDuyetGiaoAn]}>
											{trangThaiDuyetGiaoAn[trangThaiDuyet as ETrangThaiDuyetGiaoAn]
												? intl.formatMessage({
														id: trangThaiDuyetGiaoAn[trangThaiDuyet as ETrangThaiDuyetGiaoAn],
													})
												: trangThaiDuyet}
										</Tag>
									</Descriptions.Item>
								)}
								<Descriptions.Item label={intl.formatMessage({ id: 'syllabus.list.colNgayCapNhat' })}>
									{formatDateTime(ngayCapNhat)}
								</Descriptions.Item>
							</Descriptions>
						)}
					</div>
					<div
						ref={(el) => {
							if (el) {
								if (contentRef) (contentRef as any).current = el;
								if (container !== el) setContainer(el);
							}
						}}
						className='print-container syllabus-preview-scroll'
						style={{ flex: 1, overflowY: 'auto', paddingLeft: 16 }}
					>
						<SyllabusSectionsList variant='preview' isLopTinChi={isLopTinChi} form={form} />
					</div>
				</Splitter.Panel>
			</Splitter>
			{footer}
		</Form>
	);
};

const SyllabusPage = ({ lopHocPhanId }: { lopHocPhanId: string }) => {
	const { getGiaoAnSinhVienModel, loading } = useModel('lophocphan.lophocphan');
	const intl = useIntl();
	const [form] = Form.useForm();
	const previewContentRef = useRef<HTMLDivElement | null>(null);

	const handleExportPdf = useReactToPrint({
		contentRef: previewContentRef,
		documentTitle: `Syllabus_${form.getFieldValue('tieuDe') || 'syllabus'}`,
	});

	useEffect(() => {
		if (lopHocPhanId) {
			getGiaoAnSinhVienModel(lopHocPhanId).then((res: any) => {
				form.setFieldsValue(res);
			});
		}
	}, [lopHocPhanId]);

	return (
		<Card
			variant='borderless'
			loading={loading}
			extra={
				<Button type='primary' onClick={() => handleExportPdf()}>
					{intl.formatMessage({ id: 'syllabus.preview.exportToPdf' })}
				</Button>
			}
		>
			<Form form={form} component={false}>
				<SyllabusPreview previewContentRef={previewContentRef} isLopTinChi />
			</Form>
		</Card>
	);
};

export default SyllabusPage;
