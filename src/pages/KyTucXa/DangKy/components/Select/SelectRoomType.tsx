import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select Loại phòng KTX để cho vào FormItem
 */
const SelectRoomTypeKTX = (props: {
    value?: string | string[];
    onChange?: (value: any) => void;
    multiple?: boolean;
    condition?: any;
    allowClear?: boolean;
    style?: React.CSSProperties;
    isSetRecord?: boolean;
    selectMa?: boolean;
}) => {
    const { value, onChange, multiple, allowClear, style, isSetRecord, condition } = props;
    const { danhSach, getAllModel, setRecord, loading } = useModel('kytucxa.loaiphong');
    const intl = useIntl();

    useEffect(() => {
        getAllModel(undefined, undefined, condition, undefined).then(() => {
            if (!isSetRecord) setRecord?.(undefined);
        });
    }, [JSON.stringify(condition)]);
    return (
        <Select
            mode={multiple ? 'multiple' : undefined}
            value={value}
            onChange={onChange}
            options={danhSach?.map((item) => ({
				key: item._id,
				value: item.ma,
				label: item.ten,
			}))}
            showSearch
            optionFilterProp='label'
            placeholder={intl.formatMessage({ id: 'kytucxa.dangky.select.roomTypePlaceholder' })}
            allowClear={allowClear ?? false}
            style={{ width: '100%', ...style }}
            showArrow
            loading={loading}
        />
    );
};

export default SelectRoomTypeKTX;
