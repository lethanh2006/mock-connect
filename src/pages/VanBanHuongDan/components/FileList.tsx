/* eslint-disable no-underscore-dangle */
import Table from '@/components/OldTable/Table';
import type { VanBanHuongDan } from '@/services/VanBanHuongDan/typing';
import type { IColumn } from '@/utils/interfaces';
import { PaperClipOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useModel } from 'umi';
import Form from './FormFile';

const FileList = (props: { type: 'Admin' | 'User' }) => {
  const { visibleFormFile, setVisibleFormFile, record } = useModel('vanbanhuongdan');

  const columns: IColumn<VanBanHuongDan.IFile>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên văn bản',
      dataIndex: 'ten',
      search: 'search',
      align: 'center',
      width: 250,
    },
    {
      title: 'Tệp đính kèm',
      align: 'center',
      dataIndex: 'url',
      render: (val, recordFile) => (
        <>
          <PaperClipOutlined />{' '}
          <a href={val} target="_blank" rel="noreferrer">
            {recordFile.ten}
          </a>
        </>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 300,
    },
  ];

  return (
    <>
      <Table
        otherProps={{
          pagination: false,
        }}
        columns={columns}
        data={record?.danhSachTep?.map((item, index) => ({ ...item, index: index + 1 }))}
      />
      <Modal
        maskClosable={false}
        destroyOnClose
        footer={false}
        onCancel={() => setVisibleFormFile(false)}
        bodyStyle={{ padding: 0 }}
        visible={visibleFormFile}
      >
        <Form />
      </Modal>
    </>
  );
};

export default FileList;
