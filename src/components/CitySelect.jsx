import React, { useEffect, useState } from 'react'

const CitySelect = ({ options, onChange }) => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    if (value) {
      // Lấy danh sách các quận huyện của thành phố được chọn
      const city = options.find((option) => option.id === value);
      const districtOptions = city.districts;

      // Gán danh sách các quận huyện cho component DistrictSelect
      onChange(districtOptions);
    }
  }, [value]);

  return (
    <div>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        {options?.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CitySelect