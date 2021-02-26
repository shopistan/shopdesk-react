import React, { useState, useEffect } from "react";

import { Button, Select, Input } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditableSupplier from "../../organism/table/suppliersTable";
import * as SuppliersApiUtil from '../../../utils/api/suppliers-api-utils';
import { useHistory } from "react-router-dom";

const Suppliers = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const { Option } = Select;

  const history = useHistory();

  const { Search } = Input;

  const onSearch = async (e) => {
    var currValue = e.target.value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      fetchSupplierData(paginationLimit, currentPage);
    }
    else {
      const filteredData = data.filter((entry) => {
        var supplierName = entry.supplier_name;
        supplierName = supplierName.toLowerCase();
        var supplierContact = entry.supplier_contact_name;
        supplierContact = supplierContact.toLowerCase();
        var supplierEmail = entry.supplier_contact_email;
        supplierEmail = supplierEmail.toLowerCase();
        var supplierPhone = entry.supplier_contact_phone;
        supplierPhone = supplierPhone.toLowerCase();
        var supplierTax = entry.supplier_tax_number;
        supplierTax = supplierTax.toLowerCase();
        return supplierName.includes(currValue) || supplierEmail.includes(currValue) || supplierContact.includes(currValue) || supplierPhone.includes(currValue)
      });

      setData(filteredData);
    }
  }

  const fetchSupplierData = async (pageLimit = 10, pageNumber = 1) => {
    const SuppliersViewResponse = await SuppliersApiUtil.viewSuppliers(pageLimit, pageNumber);
    console.log('SuppliersViewResponse:', SuppliersViewResponse);

    if (SuppliersViewResponse.hasError) {
      console.log('Cant fetch suppliers -> ', SuppliersViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', SuppliersViewResponse);
      setData(SuppliersViewResponse.suppliers.data);
      setPaginationData(SuppliersViewResponse.suppliers.page);
      setLoading(false);
    }

  }

  useEffect(async () => {
    fetchSupplierData();
  }, []);


  function handleChange(value) {
    setPaginationLimit(value);
    setCurrentPage(1);
    setLoading(true);
    if (currentPage > Math.ceil(paginationData.totalElements / value)) {
      fetchSupplierData(value, 1);
    }
    else {
      fetchSupplierData(value, currentPage);
    }
  }

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchSupplierData(paginationLimit, currentPg);
  }

  const handleAddSupplier = () => {
    history.push({
      pathname: '/suppliers/add',
    });
  };

  return (
    <div className='page categories'>
      <div className='page__header'>
        <h1>Suppliers</h1>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={handleAddSupplier}
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
          <EditableSupplier pageLimit={paginationLimit} tableData={data} paginationData={paginationData}
            tableDataLoading={loading} onClickPageChanger={handlePageChange} currentPageIndex={currentPage} />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Suppliers;
