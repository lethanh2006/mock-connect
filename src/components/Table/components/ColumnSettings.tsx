import { HolderOutlined, SettingOutlined } from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Checkbox, Popover, Divider, Space, Popconfirm } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { useTableContext } from './TableContext';
import '../style.less';

interface SortableItemProps {
  id: string;
  label: string;
  visible: boolean;
  onToggle: (id: string) => void;
}

const SortableItem = ({ id, label, visible, onToggle }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'column-settings-item is-dragging' : 'column-settings-item'}
    >
      <HolderOutlined
        {...attributes}
        {...listeners}
        className='column-settings-handle'
      />
      <Checkbox checked={visible} onChange={() => onToggle(id)}>
        <span className='column-settings-label'>{label}</span>
      </Checkbox>
    </div>
  );
};

export const ColumnSettings: React.FC = () => {
  const intl = useIntl();
  const { columnSettings, setColumnSettings, setColumnsWidth, columns, size } = useTableContext();
  const [visible, setVisible] = React.useState(false);
  const [tempSettings, setTempSettings] = React.useState(columnSettings);
  const [shouldResetWidths, setShouldResetWidths] = React.useState(false);

  // Sync tempSettings khi mở Popover
  React.useEffect(() => {
    if (visible) {
      setTempSettings(columnSettings);
      setShouldResetWidths(false);
    }
  }, [visible, columnSettings]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTempSettings((items) => {
        const oldIndex = items.findIndex((i) => i.key === active.id);
        const newIndex = items.findIndex((i) => i.key === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleVisibility = (key: string) => {
    setTempSettings((items) =>
      items.map((item) => (item.key === key ? { ...item, visible: !item.visible } : item))
    );
  };

  const resetSettings = () => {
    const defaultSettings = columns.map((col) => ({
      key: String(col.key ?? (Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : (col.dataIndex as string))),
      visible: col.hide !== true,
    }));
    setTempSettings(defaultSettings);
    setShouldResetWidths(true);
  };

  const handleApply = () => {
    setColumnSettings(tempSettings);
    if (shouldResetWidths) {
      setColumnsWidth({});
    }
    setVisible(false);
  };

  const content = (
    <div className='column-settings-content'>
      <div className='column-settings-header'>
        <b className='column-settings-title'>
          {intl.formatMessage({ id: 'global.table.columnSetting.title' })}
        </b>
        <Popconfirm
          title={intl.formatMessage({ id: 'global.table.columnSetting.reset.confirm' })}
          onConfirm={resetSettings}
          placement='bottomRight'
        >
          <Button type='link' size='small' className='column-settings-reset'>
            {intl.formatMessage({ id: 'global.table.columnSetting.reset' })}
          </Button>
        </Popconfirm>
      </div>
      <Divider className='column-settings-divider' />
      <div className='column-settings-list'>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tempSettings.map((i) => i.key)} strategy={verticalListSortingStrategy}>
            {tempSettings.map((setting) => {
              const colDef = columns.find(
                (col) =>
                  String(
                    col.key ??
                    (Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : (col.dataIndex as string) ?? col.title)
                  ) === setting.key
              );
              return (
                <SortableItem
                  key={setting.key}
                  id={setting.key}
                  label={(colDef?.title as string) || setting.key}
                  visible={setting.visible}
                  onToggle={toggleVisibility}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
      <Divider className='column-settings-divider' />
      <div className='column-settings-footer'>
        <Space>
          <Button size='small' onClick={() => setVisible(false)}>
            {intl.formatMessage({ id: 'global.table.columnSetting.cancel' })}
          </Button>
          <Button size='small' type='primary' onClick={handleApply}>
            {intl.formatMessage({ id: 'global.table.columnSetting.apply' })}
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger='click'
      placement='bottomRight'
      arrow={{ pointAtCenter: true }}
      open={visible}
      onOpenChange={setVisible}
      overlayClassName='column-settings-popover'
    >
      <Button
        icon={<SettingOutlined />}
        size={size}
        title={intl.formatMessage({ id: 'global.table.columnSetting.tooltip' })}
      />
    </Popover>
  );
};
