import { Select } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select Tầng KTX để cho vào FormItem
 */
const SelectFloorKTX = (props: {
    value?: number | number[];
    onChange?: (value: any) => void;
    multiple?: boolean;
    condition?: any;
    allowClear?: boolean;
    style?: React.CSSProperties;
    isSetRecord?: boolean;
    selectMa?: boolean;
    disableFetch?: boolean;
}) => {
    const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disableFetch } = props;
    const { danhSach: danhSachPhong, getModel, setRecord, loading } = useModel('kytucxa.phong');
    const { danhSach: danhSachDotDangKy } = useModel('kytucxa.dotdangky');
    const intl = useIntl();

    useEffect(() => {
        if (!disableFetch) {
            getModel(condition, undefined, undefined, undefined, undefined, '').then(() => {
                if (!isSetRecord) setRecord?.(undefined);
            });
        }
    }, [JSON.stringify(condition), disableFetch]);

    const uniqueFloors = useMemo(() => {
        if (!Array.isArray(danhSachPhong)) return [];
        
        let hasRoomRestriction = false;
        const validRoomCodes = new Set<string>();

        if (Array.isArray(danhSachDotDangKy)) {
            danhSachDotDangKy.forEach((dot: any) => {
                if (Array.isArray(dot.danhSachPhong) && dot.danhSachPhong.length > 0) {
                    hasRoomRestriction = true;
                    dot.danhSachPhong.forEach((ma: string) => validRoomCodes.add(ma));
                }
            });
        }

        const floors = new Set<number>();
        danhSachPhong.forEach((item: any) => {
            if (item.tangThu !== undefined && item.tangThu !== null) {
                if (!hasRoomRestriction || validRoomCodes.has(item.ma)) {
                    floors.add(item.tangThu);
                }
            }
        });
        return Array.from(floors).sort((a, b) => a - b);
    }, [danhSachPhong, danhSachDotDangKy]);

    return (
        <Select
            mode={multiple ? 'multiple' : undefined}
            value={value}
            onChange={onChange}
            options={uniqueFloors.map((floor) => ({
                key: floor,
                value: floor,
                label: intl.formatMessage({ id: 'kytucxa.dangky.select.floorLabel' }, { floor }),
            }))}
            showSearch
            optionFilterProp='label'
            placeholder={intl.formatMessage({ id: 'kytucxa.dangky.select.floorPlaceholder' })}
            allowClear={allowClear ?? false}
            style={{ width: '100%', ...style }}
            showArrow
            loading={loading}
        />
    );
};

export default SelectFloorKTX;
