import React, { useState, useEffect } from "react";

import { Button, Select, Input, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditableCouriers from "../../organism/table/couriersTable";
import { useHistory } from "react-router-dom";
import * as CouriersApiUtil from '../../../utils/api/couriers-api-utils';


const Couriers = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);


  const { Option } = Select;

  const history = useHistory();

  const { Search } = Input;

  const onSearch = async (e) => {
    var currValue = e.target.value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      fetchCouriersData(paginationLimit, currentPage);
    }
    else {
      const filteredData = data.filter((entry) => {
        var courierName = entry.courier_name;
        courierName = courierName.toLowerCase();
        var courierCode = entry.courier_code;
        courierCode = courierCode.toLowerCase();
        return courierName.includes(currValue) || courierCode.includes(currValue);
      });
      setData(filteredData);
    }
  }

  const fetchCouriersData = async (pageLimit = 10, pageNumber = 1) => {
    const couriersViewResponse = await CouriersApiUtil.viewCouriers(pageLimit, pageNumber);
    console.log('couriersViewResponse:', couriersViewResponse);

    if (couriersViewResponse.hasError) {
      console.log('Cant fetch couriers -> ', couriersViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', couriersViewResponse);
      message.success(couriersViewResponse.message, 3);
      console.log('checking here for couriers',couriersViewResponse.courier)
      setData(couriersViewResponse.courier);
      setLoading(false);
    }
  }

  useEffect( () => {
    fetchCouriersData();
  }, []);


  function handleChange(value) {
    setPaginationLimit(value);
    setCurrentPage(1);
    setLoading(true);
    fetchCouriersData(value);
  }

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCouriersData(paginationLimit, currentPg);
  }

  const handleAddCourier = () => {
    history.push({
      pathname: '/couriers/add',
    });
  };

  return (
    <div className='page categories'>
      <div className='page__header'>
        <h1>Couriers</h1>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={() => handleAddCourier()}
        >
          Add New
        </Button>
      </div>
      <div className='page__content'>
        <div className='action-row'>
          <div className='action-row__element'>
            Show
            <Select
              defaultValue='10'
              style={{ width: 120, margin: "0 5px" }}
              onChange={handleChange}
            >
              <Option value='10'>10</Option>
              <Option value='20'>20</Option>
              <Option value='50'>50</Option>
              <Option value='100'>100</Option>
            </Select>
            entries
          </div>

          <div className='action-row__element'>
            <Search
              placeholder='search category'
              allowClear
              //enterButton='Search'
              size='large'
              onChange={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className='table'>
          <EditableCouriers pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            onClickPageChanger={handlePageChange} currentPageIndex={currentPage} />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Couriers;
