import React, {useState, useEffect} from "react";
import { Button, Select, Input, message, Menu, Dropdown } from "antd";
import { ProfileOutlined, DownOutlined  } from "@ant-design/icons";
import EdiTableProducts from "../../organism/table/productsNestedTable/productsTable";
import { useHistory } from "react-router-dom";
import * as ProductsApiUtil from '../../../utils/api/products-api-utils';


const Products = () => {
  const [paginationLimit, setPaginationLimit] = useState(20);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  

  var mounted = true;


  const { Option } = Select;
  const { Search } = Input;
  const history = useHistory();

  const onSearch = async (e) => {

    var searchValue = e.target.value;
    var pageNumber = 1;
    const productsSearchResponse = await ProductsApiUtil.searchProducts(paginationLimit, pageNumber, searchValue);
    console.log('productsSearchResponse:', productsSearchResponse);
    if (productsSearchResponse.hasError) {
      console.log('Cant Search Products -> ', productsSearchResponse.errorMessage);
    }
    else {
      console.log('res -> ', productsSearchResponse);
      message.success(productsSearchResponse.message, 3);
      setData(productsSearchResponse.products.data);
      setPaginationData(productsSearchResponse.products.page);
    }

  }

  const fetchProductsData = async (pageLimit = 20, pageNumber = 1) => {

    const productsViewResponse = await ProductsApiUtil.viewProducts(pageLimit, pageNumber);
    console.log('productsViewResponse:', productsViewResponse);

    if (productsViewResponse.hasError) {
      console.log('Cant fetch products -> ', productsViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', productsViewResponse);
      if (mounted) {     //imp if unmounted
        message.success(productsViewResponse.message, 3);
        setData(productsViewResponse.products.data);
        setPaginationData(productsViewResponse.products.page);
        setLoading(false);
      }
    }
  }

  useEffect( () => {
    fetchProductsData();

    return () => {
      mounted = false;
    }

  }, []);


  function handleChange(value) {
    setPaginationLimit(value);
    //setCurrentPage(1);
    setLoading(true);
    if (currentPage > Math.ceil(paginationData.totalElements / value)) {
      fetchProductsData(value, 1);
    }
    else {
      fetchProductsData(value, currentPage);
    }

  }

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchProductsData(paginationLimit, currentPg);
  }

 

  const PrductsMenu = (
    <Menu>
      <Menu.Item key='0' onClick={() => history.push({pathname: "products/add"}) }>
        <a>New Product</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='1' onClick={() => history.push({pathname: "products/upload"}) }>
        Upload Bulk
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='2' onClick={() => history.push({pathname: "products/lookup"}) }>
        Lookup
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='3' onClick={() => history.push({pathname: "products/discount"}) }>
        Discount
      </Menu.Item>
    </Menu>
  );



  return (
    <div className='page categories'>
      <div className='page__header'>
        <h1>Products</h1>

        <div className='page__header__buttons'>
          <Dropdown overlay={PrductsMenu} placement="bottomCenter"
            trigger={["click"]}>
            <Button
              type='Default'
              icon={<DownOutlined />}
              onClick={(e) => e.preventDefault()}
            >
              More <ProfileOutlined />
            </Button>
            </Dropdown>
        </div>
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
              placeholder='search product'
              allowClear
              //enterButton='Search'
              size='large'
              onChange={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className='table'>
          <EdiTableProducts pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            paginationData={paginationData} onClickPageChanger={handlePageChange} />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Products;
