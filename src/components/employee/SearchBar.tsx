import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const { t } = useTranslation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full md:w-80">
      <Input
        placeholder={t('employee.search_placeholder')}
        prefix={<SearchOutlined className="text-gray-400" />}
        value={value}
        onChange={handleSearch}
        allowClear
        className="w-full"
        size="large"
      />
    </div>
  );
};

export default SearchBar;
