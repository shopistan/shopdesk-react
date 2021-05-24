import React, { useState, useEffect } from "react";
import { message } from "antd";
import ViewtableSetup  from "../../../organism/table/setup/setupTable";
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';


const Outlets = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  var mounted = true;


  const fetchOutletsData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const outletsViewResponse = await SetupApiUtil.viewOutlets(pageLimit, pageNumber);
    console.log('outletsViewResponse:', outletsViewResponse);

    if (outletsViewResponse.hasError) {
      console.log('Cant fetch Outlets Data -> ', outletsViewResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', outletsViewResponse);
      if (mounted) {     //imp if unmounted
        message.success(outletsViewResponse.message, 3);
        setData(outletsViewResponse.outlets.data || outletsViewResponse.outlets);
        setPaginationData(outletsViewResponse.outlets.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }

  useEffect( () => {
    fetchOutletsData();
    
    return () => {
      mounted = false;
    }

  }, []);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchOutletsData(paginationLimit, currentPg);
  }

 

  return (
    <div className='setup-outlets'>

        {/* Table */}
        <div className='table'>
          <ViewtableSetup  pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            onClickPageChanger={handlePageChange} paginationData={paginationData} tableType="outlets" />
        </div>
        {/* Table */}
      
    </div>
  );
};

export default Outlets;
