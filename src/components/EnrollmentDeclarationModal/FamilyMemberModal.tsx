import MyDatePicker from '@/components/MyDatePicker';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectDiaChiHoSoFormItem from '@/pages/Core/DonViHanhChinh/SelectDiaChiHoSo';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Tooltip } from 'antd';
import { useEffect } from 'react';
import { FAMILY_RELATIONSHIP_OPTIONS, TRAINING_LEVEL_OPTIONS } from './guardianConstants';
import styles from './index.less';
import type { TFamilyMember } from './typing';

const PHONE_COUNTRY_OPTIONS = [
	{ value: '+84', label: 'VietNam (+84)' },
	{ value: '+1', label: 'USA (+1)' },
	{ value: '+82', label: 'Korea (+82)' },
	{ value: '+86', label: 'China (+86)' },
];

type FamilyMemberModalProps = {
	open: boolean;
	initialValues?: TFamilyMember;
	listTinh?: DonViHanhChinh.IRecord[];
	onClose: () => void;
	onSave: (values: TFamilyMember) => void;
};

const FamilyMemberModal = ({ open, initialValues, listTinh, onClose, onSave }: FamilyMemberModalProps) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (!open) return;
		form.resetFields();
		if (initialValues) form.setFieldsValue(initialValues);
	}, [open, initialValues]);

	const handleSave = async () => {
		try {
			const values = await form.validateFields();
			onSave({ ...initialValues, ...values });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Modal open={open} onCancel={onClose} closable={false} footer={null} width={1000} centered className={styles.declarationModal}>
			<div className={styles.header}>
				<h1 className={styles.title}>Add New Family Member</h1>
				<Button type='text' icon={<span>✕</span>} className={styles.closeButton} onClick={onClose} />
			</div>

			<div className={styles.content} style={{ maxHeight: '75vh' }}>
				<Form form={form} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col span={24} md={12}>
							<Form.Item name='loaiThanhVien' label='Relationship' rules={[...rules.required]}>
								<Select placeholder='Enter content' options={FAMILY_RELATIONSHIP_OPTIONS} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='fullName' label='Full Name' rules={[...rules.required, ...rules.ten]}>
								<Input placeholder='Enter content' />
							</Form.Item>
						</Col>

						<Col span={24} md={8}>
							<Form.Item name='ngaySinh' label='Date of Birth'>
								<MyDatePicker placeholder='Select' style={{ width: '100%' }} allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='quocTich' label='Nationality' initialValue='Việt Nam'>
								<SelectQuocTich allowClear selectTen />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='danToc' label='Ethnicity'>
								<SelectDanToc allowClear />
							</Form.Item>
						</Col>

						<Col span={24} md={8}>
							<Form.Item label='Phone Number' required>
								<Input.Group compact style={{ display: 'flex' }}>
									<Form.Item name='maVungDienThoai' noStyle initialValue='+84'>
										<Select style={{ width: 150 }} options={PHONE_COUNTRY_OPTIONS} />
									</Form.Item>
									<Form.Item name='soDienThoai' noStyle rules={[...rules.required]}>
										<Input style={{ flex: 1 }} placeholder='Enter' />
									</Form.Item>
								</Input.Group>
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='soDienThoai2' label='Secondary Phone Number'>
								<Input placeholder='Enter content' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='email' label='Email' rules={[...rules.email]}>
								<Input placeholder='Enter content' />
							</Form.Item>
						</Col>

						<Col span={24} md={8}>
							<Form.Item name='tonGiao' label='Religion'>
								<SelectTonGiao allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='ngheNghiep' label='Occupation'>
								<Input placeholder='Enter content' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='coQuanCongTac' label='Employer'>
								<Input placeholder='Enter content' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='trinhDoDaoTao' label='Training Level' initialValue='Undergraduate'>
								<Select placeholder='Enter content' allowClear options={TRAINING_LEVEL_OPTIONS} />
							</Form.Item>
						</Col>
					</Row>

					<div className={styles.subLabel}>Permanent Residence</div>
					<Form.Item name='hoKhauThuongTru'>
						<SelectDiaChiHoSoFormItem
							listTinh={listTinh}
							labelTinh='Province/City'
							placeholderTinh='Enter content'
							labelXaPhuong='Commune/Ward/Special zone'
							placeholderXaPhuong='Enter content'
						/>
					</Form.Item>

					<div className={styles.subLabel}>Current Address</div>
					<Form.Item name='diaChiHienNay'>
						<SelectDiaChiHoSoFormItem
							listTinh={listTinh}
							hasSoNha
							labelTinh='Province/City'
							placeholderTinh='Enter content'
							labelXaPhuong='Commune/Ward/Special zone'
							placeholderXaPhuong='Enter content'
							labelSoNha='House Number/Street Name'
							placeholderSoNha='Enter content'
						/>
					</Form.Item>

					<Row gutter={[12, 0]}>
						<Col span={24} md={12}>
							<Form.Item name='soTheBHYT' label='Health Insurance Card Number'>
								<Input placeholder='Enter content' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='hoatDongChinhTriXaHoi' label='Political and Social Activities'>
								<Input placeholder='Enter content' />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item name='laLienLacKhanCap' valuePropName='checked'>
						<Checkbox>
							This is my emergency contact.{' '}
							<Tooltip title='VinUniversity may contact this person in an emergency involving you.'>
								<InfoCircleOutlined />
							</Tooltip>
						</Checkbox>
					</Form.Item>
					<Form.Item name='taoTaiKhoan' valuePropName='checked'>
						<Checkbox>
							Create family account{' '}
							<Tooltip title='This family member will be invited to create an account to view your academic and financial information.'>
								<InfoCircleOutlined />
							</Tooltip>
						</Checkbox>
					</Form.Item>
				</Form>
			</div>

			<div className={styles.footer}>
				<Button onClick={onClose}>CLOSE</Button>
				<Button type='primary' onClick={handleSave}>
					SAVE
				</Button>
			</div>
		</Modal>
	);
};

export default FamilyMemberModal;
