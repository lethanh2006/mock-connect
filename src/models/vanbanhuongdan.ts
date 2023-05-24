import useInitModel from '@/hooks/useInitModel';
import type { VanBanHuongDan } from '@/services/VanBanHuongDan/typing';
import { ip3 } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  const [editFile, setEditFile] = useState<boolean>(false);

  const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
  const [visibleFileList, setVisibleFileList] = useState<boolean>(false);
  const [recordFile, setRecordFile] = useState<VanBanHuongDan.IFile>();

  const objInit = useInitModel<VanBanHuongDan.IRecord>(
    'van-ban-huong-dan',
    'condition',
    undefined,
    ip3,
  );
  return {
    recordFile,
    setRecordFile,
    editFile,
    setEditFile,
    visibleFileList,
    setVisibleFileList,
    visibleFormFile,
    setVisibleFormFile,
    ...objInit,
  };
};
