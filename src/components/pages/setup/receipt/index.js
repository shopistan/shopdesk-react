import React, { useState, useEffect } from "react";
import { message } from "antd";
import ViewtableSetup from "../../../organism/table/setup/setupTable";
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';


const Receipts = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});



  const fetchUsersTemplatesData = async (pageLimit = 10, pageNumber = 1) => {
    const userTemplatesViewResponse = await SetupApiUtil.viewTemplates(pageLimit, pageNumber);
    console.log('userTemplatesViewResponse:', userTemplatesViewResponse);

    if (userTemplatesViewResponse.hasError) {
      console.log('Cant fetch Users templates Data -> ', userTemplatesViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', userTemplatesViewResponse);
      message.success(userTemplatesViewResponse.message, 3);
      setData(userTemplatesViewResponse.templates.data || userTemplatesViewResponse.templates);
      setPaginationData(userTemplatesViewResponse.templates.page || {});
      setLoading(false);
    }
  }

  useEffect( () => {
    fetchUsersTemplatesData();
  }, []);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchUsersTemplatesData(paginationLimit, currentPg);
  }

 

  return (
    <div className='setup-templates'>

        {/* Table */}
        <div className='table'>
          <ViewtableSetup  pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            onClickPageChanger={handlePageChange} paginationData={paginationData} tableType="receipts" />
        </div>
        {/* Table */}

    </div>
  );
};

export default Receipts;
