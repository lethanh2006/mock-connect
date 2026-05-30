import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select Đợt Đăng Ký KTX để cho vào FormItem
 */
const SelectDotDangKyKTX = (props: {
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
    const { danhSach, getModel, setRecord, loading } = useModel('kytucxa.dotdangky');
    const intl = useIntl();

    useEffect(() => {
    	getModel(undefined).then(() => {
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
                value: item._id,
                label: `${item.tenDot}`,
            }))}
            showSearch
            optionFilterProp='label'
            placeholder={intl.formatMessage({ id: 'kytucxa.lichsu.select.periodPlaceholder' })}
            allowClear={allowClear ?? false}
            style={{ width: '100%', ...style }}
            showArrow
            loading={loading}
        />
    );
};

export default SelectDotDangKyKTX;
