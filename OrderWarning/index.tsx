import * as React from "react";
import * as qs from "query-string";
import Tab from "../../components/Tab";
import NoData from "../../components/NoData";
import Card from "./components/Card";
import * as styles from "./index.scss";
import * as api from "../../services/orderWarning";
import { withRouter, Route } from "react-router-dom";
import { Toast } from "antd-mobile";

const { useState, useEffect, useRef, useLayoutEffect } = React;

export default withRouter(
  React.memo(() => {

  const [error, setError] = useState(null);
  const [msgId, setMsgId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [apiDone, setApiDone] = useState(true);
  const [salesReturnData, setSalesReturnData] = useState([]);
  const [unfilledOrderData, setUnfilledOrderData] = useState([]);
  const [unfilledOrderNum, setUnfilledOrderNum] = useState(null);
  const [salesReturnNum, setSalesReturnNum] = useState(null);
  const [data, setData] = useState([]);
  const [screens, setScreens] = useState(null);
  ;

  useEffect(() => {
    const params = qs.parse(window.location.search);
    const { msgid } = params;
    setMsgId(msgid);
    fetchData(msgid);
  }, [])

  const fetchData = msgid => {
    setApiDone(false);
    Toast.loading("加载中...", null, null, true);
    api.getSaleWarn({ msgid }, true).then((res: any) => {
    Toast.hide();
      setApiDone(true);
      if (res) {
        const {
          title,
          unfilledOrderList = [],
          salesReturnList = [],
          dateNow,
          salesReturnNum = 0,
          unfilledOrderNum = 0
        } = res;
        const tempTab = unfilledOrderList.length > 0 ? 0 : salesReturnList.length > 0 ? 1 : 0;
        setActiveTab(tempTab);
        setSalesReturnData(salesReturnList);
        setUnfilledOrderData(unfilledOrderList);
        document.title = title;
        const tempData = tempTab == 1 ? salesReturnList : unfilledOrderList;
        const sIndex = tempData.findIndex(v => {
          return v.isDispose == 'false';
        });
        sIndex >= 0 && setScreens(sIndex);
        setData(tempData);
        setSalesReturnNum(salesReturnNum);
        setUnfilledOrderNum(unfilledOrderNum);
      }
    }).catch(err => {
      Toast.hide();
      setApiDone(true);
      setError(err);
    });
  }; 

  const changeTab = ({ id, key }) => {
    setActiveTab(key);
    const tempData = key == 1 ? salesReturnData : unfilledOrderData;
    setScreens(null);
    const sIndex = tempData.findIndex(v => {
      return v.isDispose == "false";
    });
    sIndex >= 0 && setScreens(sIndex);
     setData(tempData);
  };

  const clickTab = ({ id, key }) => {
    scrollToAnchor("screens");
  };

  const scrollToAnchor = anchorName => {
    if (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: "center" });
      }
    }
  };

  const submit = e => {
    const { params, index } = e;
    const { disposeModeLabel = null, disposeResultLabel = null, ...postData } = params;
    Toast.loading("提交中...", null, null, true);
    api.submitResult({ postData, msgid: msgId }, true).then((res: any) => {
        Toast.hide();
        data[index].isDispose = "true";
        data[index].disposeMode = disposeModeLabel;
        data[index].disposeResult = disposeResultLabel;
        data[index].commentResult = postData.commentResult;
        data[index].planTime = postData.planTime;
        Toast.success("提交成功", 1);
        setData([...data]);
        if (activeTab == 0) {
          setUnfilledOrderNum(unfilledOrderNum - 1);
        } else {
          setSalesReturnNum(salesReturnNum - 1);
        }
      }).catch(err => {
         Toast.hide();
         Toast.fail("提交失败，请稍后重试~", 1);
      });
  }

  return (
    <div className={styles.orderWrap}>
      {apiDone == true && (
        <Tab
          data={[
            {
              id: 0,
              name: "未发货订单",
              tag: `${unfilledOrderNum}`
            },
            { id: 1, name: "退货订单", tag: `${salesReturnNum}` }
          ]}
          current={activeTab}
          handleChange={changeTab}
          handleClick={clickTab}
        />
      )}
      {data && data.length > 0 ? (
        data.map((v, index) => {
          return (
            <Card
              screens={screens}
              key={index}
              data={v}
              index={index}
              submit={submit}
              activeTab={activeTab}
            />
          );
        })
      ) : (
        apiDone == true && <NoData />
      )}
    </div>
  );
}));
