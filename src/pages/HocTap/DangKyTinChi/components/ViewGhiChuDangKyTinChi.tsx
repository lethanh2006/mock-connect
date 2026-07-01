import step1En from '@/assets/dktc/step1-en.png';
import step1Vn from '@/assets/dktc/step1-vn.png';
import step2En from '@/assets/dktc/step2-en.png';
import step2Vn from '@/assets/dktc/step2-vn.png';
import step3En from '@/assets/dktc/step3-en.png';
import step3Vn from '@/assets/dktc/step3-vn.png';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { tinhChatDangKyTC } from '@/services/DaoTao/DangKyTinChi/constant';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { Divider, Space } from 'antd';
import { getLocale, useIntl, useModel } from 'umi';

const stepImages = {
	en: { step1: step1En, step2: step2En, step3: step3En },
	vn: { step1: step1Vn, step2: step2Vn, step3: step3Vn },
};

const ViewGhiChuDangKyTinChi = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const locale = getLocale();
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');
	const { settings } = useModel('tienich.caidat');
	const stepImageStyle = { width: '100%', maxWidth: 800, borderRadius: 4 };
	const imageLocale = locale === 'vi-VN' ? 'vn' : 'en';
	const dangKyNgay = !!settings?.SINH_VIEN?.dktcMultiple;

	const { step1: step1Image, step2: step2Image, step3: step3Image } = stepImages[imageLocale];
	const renderStepImage = (src: string, alt: string) => (
		<img
			src={src}
			alt={alt}
			style={stepImageStyle}
			onError={(event) => {
				event.currentTarget.style.display = 'none';
			}}
		/>
	);

	return (
		<ModalExpandable
			title={intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtindangky' })}
			open={visible}
			footer={null}
			onCancel={() => setVisible(false)}
			width={900}
		>
			<>
				<Divider size='small' className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
					{intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtinkyhoc' })}
				</Divider>

				<Space direction='vertical' size={4}>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tenhocky' })}</strong>: {recHocKy?.ten ?? '--'}
					</div>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.sotuanhoc' })}</strong>: {recHocKy?.soTuan ?? '--'}
					</div>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.thoigianbatdauhocky' })}</strong>:{' '}
						{recHocKy?.thoiGianBatDau ? formatDate(recHocKy.thoiGianBatDau) : '--'}
					</div>
				</Space>

				{dotDangKyHienTai ? (
					<>
						<Divider size='small' className='divider-big-title' orientation='left'>
							{intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtindotdangky' })}
						</Divider>

						<Space direction='vertical' size={4}>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tendotdangky' })}</strong>:{' '}
								{dotDangKyHienTai?.ten ?? '--'}
							</div>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.batdau' })}</strong>:{' '}
								{dotDangKyHienTai?.thoiGianBatDau ? formatDateTime(dotDangKyHienTai.thoiGianBatDau) : '--'}
							</div>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.ketthuc' })}</strong>:{' '}
								{dotDangKyHienTai?.thoiGianKetThuc ? formatDateTime(dotDangKyHienTai.thoiGianKetThuc) : '--'}
							</div>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tinhchat' })}</strong>:{' '}
								{dotDangKyHienTai?.tinhChatDangKy
									? intl.formatMessage({ id: tinhChatDangKyTC[dotDangKyHienTai.tinhChatDangKy] })
									: '--'}
							</div>
						</Space>
					</>
				) : null}

				<Divider size='small' className='divider-big-title' orientation='left'>
					{intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtinbosung' })}
				</Divider>

				<Space direction='vertical' size={4}>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tatcahocphan' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.tatcahocphan.mota' })}
					</div>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.theokehoachgiangday' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.theokehoachgiangday.mota' })}
					</div>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhdaotao' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhdaotao.mota' })}
					</div>
					{/* <div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhnganh2' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhnganh2.mota' })}
					</div> */}
				</Space>

				<Divider size='small' className='divider-big-title' orientation='left'>
					{intl.formatMessage({ id: 'dangkytinchi.duongdan.huongdandangky' })}
				</Divider>

				<Space direction='vertical' size={4}>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc1' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc1.mota' })}
					</div>
					{renderStepImage(step1Image, intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc1' }))}
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc2' })}</strong>:{' '}
						{dangKyNgay
							? intl.formatMessage(
									{ id: 'dangkytinchi.duongdan.buoc2.mota' },
									{
										dangky: (
											<b style={{ color: '#134D8B' }}>{intl.formatMessage({ id: 'dangkytinchi.duongdan.dangky' })}</b>
										),
									},
								)
							: intl.formatMessage(
									{ id: 'dangkytinchi.duongdan.buoc2.multiple.mota' },
									{
										chon: (
											<b style={{ color: '#134D8B' }}>{intl.formatMessage({ id: 'dangkytinchi.duongdan.chon' })}</b>
										),
									},
								)}
					</div>
					{renderStepImage(step2Image, intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc2' }))}
					{!dangKyNgay ? (
						<>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc3' })}</strong>:{' '}
								{intl.formatMessage(
									{ id: 'dangkytinchi.duongdan.buoc3.mota' },
									{
										dangky: (
											<b style={{ color: '#134D8B' }}>{intl.formatMessage({ id: 'dangkytinchi.duongdan.dangky' })}</b>
										),
									},
								)}
							</div>
							{renderStepImage(step3Image, intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc3' }))}
						</>
					) : null}
				</Space>
			</>
		</ModalExpandable>
	);
};

export default ViewGhiChuDangKyTinChi;
