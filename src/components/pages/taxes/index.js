import React, {useState, useEffect} from "react";

import { Button, Select, Input, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import TaxesViewTable from "../../organism/table/taxesTable";
import { useHistory } from "react-router-dom";
import * as TaxApiUtil from '../../../utils/api/tax-api-utils';


const Taxes = () => {
  const history = useHistory();
  const { Search } = Input;

  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const { Option } = Select;


  const onSearch = async (e) => {
  
    var currValue = e.target.value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      fetchTaxesData(paginationLimit, currentPage);
    }
    else {
      const filteredData = data.filter((entry) => {
        var taxName = entry.tax_name;
        taxName = taxName.toLowerCase();
        var taxValue = entry.tax_value;
        taxValue = taxValue.toLowerCase();
  
        return taxName.includes(currValue) || taxValue.includes(currValue);
      });


      setData(filteredData);
      paginationData.totalElements=filteredData.length;
      setPaginationData(paginationData);
      setPaginationLimit(paginationLimit);

    }
  }

  const fetchTaxesData = async (pageLimit = 10, pageNumber = 1) => {
    const taxesViewResponse = await TaxApiUtil.viewTaxes(pageLimit, pageNumber);
    console.log('taxesViewResponse:', taxesViewResponse);

    if (taxesViewResponse.hasError) {
      console.log('Cant fetch taxes -> ', taxesViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', taxesViewResponse);
      setData(taxesViewResponse.taxes.data || taxesViewResponse.taxes);
      message.success(taxesViewResponse.message, 3);
      setPaginationData(taxesViewResponse.taxes.page || {} );
      setLoading(false);
    }

  }

  useEffect(async () => {
    fetchTaxesData();
  }, []);


  function handleChange(value) {
    setPaginationLimit(value);
    setLoading(true);
    if (currentPage > Math.ceil(paginationData.totalElements / value)) {
      fetchTaxesData(value, 1);
    }
    else {
      fetchTaxesData(value, currentPage);
    }
  }

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchTaxesData(paginationLimit, currentPg);
  }

  const handleAddTaxes = () => {
    history.push({
      pathname: '/taxes/add',
    });
  };


  return (
    <div className='page categories'>
      <div className='page__header'>
        <h1>Taxes</h1>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={handleAddTaxes}
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
              size='large'
              onChange={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className='table'>
          <TaxesViewTable  pageLimit={paginationLimit} tableData={data} paginationData={paginationData}
            tableDataLoading={loading} onClickPageChanger={handlePageChange} />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Taxes;
