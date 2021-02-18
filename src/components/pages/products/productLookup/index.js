import React from "react";

import { Input } from "antd";

const ProductLookup = () => {
  const { Search } = Input;
  const onSearch = (value) => console.log(value);

  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Product Lookup</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <h2>Select a Product</h2>
          <Search
            placeholder='Select a Product'
            allowClear
            enterButton='Fetch'
            size='large'
            loading
            onSearch={onSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductLookup;
