import React, { useState, useEffect } from "react";
import { message } from "antd";
import ViewtableSetup from "../../../organism/table/setup/setupTable";
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';


const Users = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  var mounted = true;


  const fetchUsersData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const usersViewResponse = await SetupApiUtil.viewUsers(pageLimit, pageNumber);
    console.log('usersViewResponse:', usersViewResponse);

    if (usersViewResponse.hasError) {
      console.log('Cant fetch Users Data -> ', usersViewResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', usersViewResponse);
      if (mounted) {    //imp if unmounted
        //message.success(usersViewResponse.message, 3);
        setData(usersViewResponse.Users.data || usersViewResponse.Users);
        setPaginationData(usersViewResponse.Users.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }


  useEffect( () => {
    fetchUsersData();
    
    return () => {
      mounted = false;
    }

  }, []);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchUsersData(paginationLimit, currentPg);
  }


  return (
    <div className='setup-users'>

        {/* Table */}
        <div className='table'>
          <ViewtableSetup  pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            onClickPageChanger={handlePageChange} paginationData={paginationData} tableType="users" />
        </div>

        {/* Table */} 
    </div>
  );
};

export default Users;
