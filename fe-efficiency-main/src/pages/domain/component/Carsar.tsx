import React, { useState } from 'react';
import { Cascader } from 'antd';

import { domainSegmentList } from '@/services/domain';

interface Option {
  value?: string | number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
  disabled?: boolean;
}

const optionLists: Option[] = [
  {
    value: '1',
    label: '内网',
    isLeaf: false,
    children: [],
  },
  {
    value: '2',
    label: '外网',

    isLeaf: false,
    children: [],
  },
];

const App: React.FC<any> = (props: any) => {
  const [options, setOptions] = useState<Option[]>(optionLists);

  const handleGetsegent = async (segmentType: any) => {
    try {
      const res = await domainSegmentList(segmentType);
      if (res.success) {
        let data = res?.data?.rows || [];
        data = data.map((item: any) => {
          return {
            label: item?.name,
            value: item?.id,
            channel: item?.channel,
          };
        });
        return data;
      }
    } catch (error) {}
  };
  const displayRender = (labels: string[]) => labels[1];

  const loadData = async (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    // load options lazily

    targetOption.children = await handleGetsegent(targetOption.value);
    setOptions([...options]);
  };

  return (
    <Cascader
      displayRender={displayRender}
      allowClear
      {...props}
      options={options}
      loadData={loadData}
      changeOnSelect={true}
    />
  );
};

export default App;
