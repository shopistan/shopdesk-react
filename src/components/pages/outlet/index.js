import React, { useState, useEffect } from "react";
import { message, Spin } from 'antd';
import "./style.scss";
import { 
  saveDataIntoLocalStorage,
  getDataFromLocalStorage,
  clearLocalUserData,
  checkUserAuthFromLocalStorage, 
} from "../../../utils/local-storage/local-store-utils";
import { useHistory } from 'react-router-dom';
import * as OutletsApiUtil from '../../../utils/api/oulets-api-utils';
import Constants from '../../../utils/constants/constants';


const Outlet = () => {
  const history = useHistory();
  const [storeInfo, setStoreInfo] = useState([]);
  const [loginCacheData, setLoginCacheData] = useState({});
  const [activeOutlet, setActiveOutlet] = useState(null);
  const [loading, setLoading] = useState(false);

  var mounted = true;


  useEffect( () => {
    
    let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    fetchAllOutletsData(readFromLocalStorage);   //imp
    
    return () => {
      mounted = false;
    }

  }, []);



  /*const fetchOutlets =  (localStorageData) => {

    if (localStorageData) {
      setLoginCacheData(localStorageData);
      if (checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication) {
        setStoreInfo(localStorageData.auth.storeInfo);
        setActiveOutlet(localStorageData.auth.current_store);
        document.getElementById('app-loader-container').style.display = "none";
      }
      else {
        setStoreInfo(localStorageData.store_info);
        setActiveOutlet(null);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }

  }*/



  const fetchAllOutletsData = async (localStorageData) => {

    document.getElementById('app-loader-container').style.display = "block";
    const outletsViewResponse = await OutletsApiUtil.viewAllOutlets();
    console.log('outletsViewResponse:', outletsViewResponse);

    if (outletsViewResponse.hasError) {
      console.log('Cant fetch Outlets Data -> ', outletsViewResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', outletsViewResponse);

      if (mounted) {     //imp if unmounted
        //message.success(outletsViewResponse.message, 3);
        if (localStorageData) {
          setLoginCacheData(localStorageData);
          if (checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication) {
            setStoreInfo(outletsViewResponse && outletsViewResponse.outlets);
            setActiveOutlet(localStorageData.auth.current_store);
            document.getElementById('app-loader-container').style.display = "none";
          }
          else {
            setStoreInfo(outletsViewResponse && outletsViewResponse.outlets);
            setActiveOutlet(null);
            document.getElementById('app-loader-container').style.display = "none";
          }
        }
        
      }

    }

  }



  const onSelectOutlet = async (e) => {
    const selectedStoreId = e.target.dataset.storeid;
    var foundStoreObj = storeInfo.find(obj => {
      return obj.store_id === selectedStoreId
    });
    setLoading(true);

    if (foundStoreObj) {
      document.getElementById('app-loader-container').style.display = "block";
      const userSelectOutletResponse = await OutletsApiUtil.selectOutlet(foundStoreObj.store_random);
      console.log('userSelectOutletResponse:', userSelectOutletResponse)
      if (userSelectOutletResponse.hasError) {
        console.log('Cant Select Outlet -> ', userSelectOutletResponse.errorMessage);
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
        message.error('Store Change UnSuccesfull ', 3);
        
      }
      else {
        console.log('res -> ', userSelectOutletResponse);
        if (mounted) {     //imp if unmounted
          userSelectOutletResponse.refresh_token = loginCacheData.refresh_token;
          userSelectOutletResponse.user_info = loginCacheData.user_info;
          clearLocalUserData();
          saveDataIntoLocalStorage("user", userSelectOutletResponse);
          setLoading(false);
          document.getElementById('app-loader-container').style.display = "none";
          message.success('Store Change Succesfull ', 2);
          setTimeout(() => {
            history.push({
              pathname: '/dashboard',
            });
          }, 2000);
        }

      }

    }
    else { console.log("store not found"); setLoading(false); }

  } 



  return (
    <div className='page outlet'>
      
      <div className='page__header'>
        <h1>Select an Outlet</h1>
      </div>

      <div className='page__content' >
        <ul className='outlet__select outlets-list-container'>
          {
            storeInfo.map(item => {
              return (
                <li key={item.store_id}
                  className={ `outlet__link${activeOutlet == item.store_id ? ' outlet__active' : ''}` }
                  data-storeid={item.store_id} onClick={onSelectOutlet}>
                  {item.store_name}
                </li>
              )
            })
          }

        </ul>
      </div>
    </div>
  );
};

export default Outlet;
