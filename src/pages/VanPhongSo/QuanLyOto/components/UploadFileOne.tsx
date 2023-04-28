import { UploadOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useState } from 'react';

type UploadFormItemProps = {
  value?: any[];
  onChange?: ({ fileList }: any) => void;
};

const UploadOne: React.FC<UploadFormItemProps> = ({ value, onChange }) => {
  const [fileList, setFileList] = useState(value ?? []);

  const handleChange = ({ fileList: fl }: any) => {
    const file = fl?.slice(-1) ?? [];
    setFileList(file);
    if (onChange) onChange({ fileList: file });
  };

  const beforeUpload = (file: RcFile) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Dung lượng file phải nhỏ hơn 5MB!');
    }
    return isLt5M;
  };

  return (
    <Upload.Dragger
      customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
      fileList={fileList}
      onChange={handleChange}
      listType="text"
      accept=".xls,.xlsx"
      maxCount={1}
      beforeUpload={beforeUpload}
      style={{ marginTop: 24 }}
    >
      <UploadOutlined style={{ fontSize: 32, color: 'rgb(217, 53, 35)' }} />
      <br />
      Chọn file
    </Upload.Dragger>
  );
};

export default UploadOne;
