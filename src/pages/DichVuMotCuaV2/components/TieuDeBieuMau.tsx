const TieuDeBieuMau = (props: { title: string }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '-7px', fontSize: '18px' }}>HỘI LIÊN HIỆP PHỤ NỮ VIỆT NAM</p>
          <p
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            <div>HỌC VIỆN PHỤ NỮ VIỆT NAM</div>
            <div style={{ height: '1px', backgroundColor: '#000000', width: '50%' }} />
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '-7px', fontWeight: 600, fontSize: '18px' }}>
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </p>
          <p
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            <div>Độc lập - Tự do - Hạnh phúc</div>
            <div style={{ height: '1px', backgroundColor: '#000000', width: '50%' }} />
          </p>
        </div>
      </div>

      <p
        style={{
          textAlign: 'center',
          fontWeight: 650,
          fontSize: '22px',
          textTransform: 'uppercase',
        }}
      >
        {props.title}
      </p>
      <p
        style={{ fontSize: '16px', display: 'flex', fontWeight: 'bold', justifyContent: 'center' }}
      >
        <div style={{ marginRight: 8 }}>Kính gửi:</div>
        <div>
          <div>- Ban Giám đốc Học viện Phụ nữ Việt Nam;</div>
          <div>- Phòng Công tác sinh viên</div>
        </div>
      </p>
    </>
  );
};

export default TieuDeBieuMau;
