import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select Quốc tịch sinh viên để cho vào FormItem
 */
const SelectQuocTichSinhVienKTX = (props: {
    value?: string;
    onChange?: (id: string) => void;
    multiple?: boolean;
    condition?: any;
    allowClear?: boolean;
    style?: React.CSSProperties;
    isSetRecord?: boolean;
    selectMa?: boolean;
}) => {
    const { value, onChange, multiple, condition, allowClear, style, isSetRecord } = props;
    const { danhSach, getAllModel, setRecord, loading } = useModel('kytucxa.quoctichsinhvien');
    const intl = useIntl();

    useEffect(() => {
        getAllModel(undefined, undefined, condition).then(() => {
            if (!isSetRecord) setRecord(undefined);
        });
    }, [JSON.stringify(condition)]);

    return (
        <Select
            mode={multiple ? 'multiple' : undefined}
            value={value}
            onChange={onChange}
            options={danhSach.map((item) => ({
                key: item._id,
                value: item.tenQuocTich,
                label: `${item.tenQuocTich}`,
            }))}
            showSearch
            optionFilterProp='label'
            placeholder={intl.formatMessage({ id: 'kytucxa.dangky.select.nationalityPlaceholder' })}
            allowClear={allowClear ?? false}
            style={{ width: '100%', ...style }}
            showArrow
            loading={loading}
        />
    );
};

export default SelectQuocTichSinhVienKTX;
