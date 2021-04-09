import React, { useState, useEffect } from "react";

import { Button, Select, Input, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditableCouriers from "../../organism/table/couriersTable";
import { useHistory } from "react-router-dom";
import * as CouriersApiUtil from "../../../utils/api/couriers-api-utils";

const Couriers = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataSearched, setDataSearched] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  const { Option } = Select;

  const history = useHistory();

  const { Search } = Input;

  const onSearch = async (e) => {
    var currValue = e.target.value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      setLoading(true);
      fetchCouriersData(paginationLimit, currentPage);
    } else {
      const filteredData = dataSearched.filter((entry) => {
        var courierName = entry.courier_name;
        courierName = courierName.toLowerCase();
        var courierCode = entry.courier_code;
        courierCode = courierCode.toLowerCase();
        return (
          courierName.includes(currValue) || courierCode.includes(currValue)
        );
      });
      setData(filteredData);
      paginationData.totalElements = filteredData.length;
      setPaginationData(paginationData);
      setPaginationLimit(paginationLimit);
    }
  };

  const fetchCouriersData = async (pageLimit = 10, pageNumber = 1) => {
    const couriersViewResponse = await CouriersApiUtil.viewCouriers(
      pageLimit,
      pageNumber
    );
    console.log("couriersViewResponse:", couriersViewResponse);

    if (couriersViewResponse.hasError) {
      console.log("Cant fetch couriers -> ", couriersViewResponse.errorMessage);
      setLoading(false);
    } else {
      console.log("res -> ", couriersViewResponse);
      message.success(couriersViewResponse.message, 3);
      const couriersData = couriersViewResponse.courier.data || couriersViewResponse.courier;
      /*----------handle data serching response------------*/
      handledSearchedDataResponse(couriersData);
      /*-----------handle data serching response-----------*/
      setData(couriersData);
      setPaginationData(couriersViewResponse.courier.page || {});
      setLoading(false);
    }
  };


  
  function handledSearchedDataResponse(dataResponse) {
    var newData = [...dataSearched];
    dataResponse.forEach(item => {
      var foundObj = newData.find(obj => {
        return obj.courier_id === item.courier_id;
      });

      if(!foundObj){
        newData.push(item);
      }
    });
    //console.log(newData);
    setDataSearched(newData);
  }



  useEffect(() => {
    fetchCouriersData();
  }, []);

  function handleChange(value) {
    setPaginationLimit(value);
    setLoading(true);
    if (currentPage > Math.ceil(paginationData.totalElements / value)) {
      fetchCouriersData(value, 1);
    } else {
      fetchCouriersData(value, currentPage);
    }
  }

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCouriersData(paginationLimit, currentPg);
  }

  const handleAddCourier = () => {
    history.push({
      pathname: "/couriers/add",
    });
  };

  return (
    <div className="page categories">
      <div className="page__header">
        <h1>Couriers</h1>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => handleAddCourier()}
          className="custom-btn custom-btn--primary"
        >
          Add New
        </Button>
      </div>
      <div className="page__content">
        <div className="action-row">
          <div className="action-row__element">
            Show
            <Select
              defaultValue="10"
              style={{ width: 120, margin: "0 5px" }}
              onChange={handleChange}
            >
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="50">50</Option>
              <Option value="100">100</Option>
            </Select>
            entries
          </div>

          <div className="action-row__element">
            <Search
              placeholder="search courier"
              allowClear
              //enterButton='Search'
              size="large"
              onChange={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table">
          <EditableCouriers
            pageLimit={paginationLimit}
            tableData={data}
            tableDataLoading={loading}
            onClickPageChanger={handlePageChange}
            paginationData={paginationData}
          />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Couriers;
