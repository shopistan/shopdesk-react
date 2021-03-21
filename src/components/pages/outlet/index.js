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


  useEffect(async () => {
    var readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    if (readFromLocalStorage) {
      setLoginCacheData(readFromLocalStorage);
      if (checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication) {
        setStoreInfo(readFromLocalStorage.auth.storeInfo);
        setActiveOutlet(readFromLocalStorage.auth.current_store);
      }
      else {
        setStoreInfo(readFromLocalStorage.store_info);
        setActiveOutlet(null);
      }
    }

  }, []);


  const onSelectOutlet = async (e) => {
    const selectedStoreId = e.target.dataset.storeid;
    var foundStoreObj = storeInfo.find(obj => {
      return obj.store_id === selectedStoreId
    });
    setLoading(true);

    if (foundStoreObj) {
      const userSelectOutletResponse = await OutletsApiUtil.selectOutlet(foundStoreObj.store_random);
      console.log('userSelectOutletResponse:', userSelectOutletResponse)
      if (userSelectOutletResponse.hasError) {
        console.log('Cant Select Outlet -> ', userSelectOutletResponse.errorMessage);
        message.error('Store Change UnSuccesfull ', 3);
        setLoading(false);
      }
      else {
        console.log('res -> ', userSelectOutletResponse);
        userSelectOutletResponse.refresh_token = loginCacheData.refresh_token; 
        userSelectOutletResponse.user_info = loginCacheData.user_info; 
        clearLocalUserData();
        saveDataIntoLocalStorage("user", userSelectOutletResponse);
        setLoading(false);
        message.success('Store Change Succesfull ', 3);
        setTimeout(() => {
          history.push({
            pathname: '/dashboard',
        });
        }, 2000);
      }
    }
    else { console.log("store not found"); setLoading(false); }

  }



  return (
    <div className='page outlet'>
      <div className="loading-container">
        {loading && <Spin size="large" />}
      </div>
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
