import * as React from "react";
import * as styles from './index.scss';
import { Picker, DatePicker, InputItem } from "antd-mobile";
import * as statusData from "../../statusData";

interface IProps {
  data: any,
  submit?: any,
  activeTab?: any,
  index: any,
  screens?: any,
}

const { useState, useEffect } = React;
export default React.memo((props: IProps) => {
  const [disposeCMode, setDisposeCMode] = useState(null); // 处理方式
  const [planCTime, setPlanCTime] = useState(null); // 发货时间
  const [disposeCResult, setDisposeCResult] = useState(null); // 补充原因
  const [remarks, setRemarks] = useState(''); // 具体说明
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [pushTimeLabel, setPushTimeLabel] = useState("");

  const { data = {}, submit, index, activeTab = 0, screens = null} = props;
  const {
    WIllDEALMETHOD,
    WILLRESONS,
    CANCELRESULT,
    DONEDEALMETHOD
  } = statusData;

  
  const {
    dataType,
    pushTime, // 推送时间
    isDispose, // 是否处理
    shoppeName, //  柜组名
    orderNo, // 订单号
    guideName, // 导购名
    msgid,
    msgseq,
    payTime, // 支付时间
    disposeMode, // 处理方式
    planTime, // 预计发货时间
    disposeResult, // 处理结果
    commentResult // 具体说明
  } = data;

   useEffect(() => {
    if (data) {
      const nowTimeStamp = new Date(pushTime);
      pushTime && filterDate();
      const maxTimes = nowTimeStamp.getTime() + 60 * 60 * 1000 * 24 * 90;
      const max = new Date(maxTimes);
      setDisposeCMode(null);
      setDisposeCResult(null);
      setRemarks("");
      // setPushTimeLabel("");
      setMinDate(nowTimeStamp);
      setIsSubmit(false);
      setMaxDate(max);
    }
  }, [data]);
  
  const filterDate = () => {
    const nowTimeStamp = new Date(pushTime);
    const m = nowTimeStamp.getMonth() + 1 >= 10
        ? nowTimeStamp.getMonth() + 1
        : `0${nowTimeStamp.getMonth() + 1}`;
    const d = nowTimeStamp.getDate() >= 10
        ? nowTimeStamp.getDate()
        : `0${nowTimeStamp.getDate()}`;
    const h = nowTimeStamp.getHours() >= 10
        ? nowTimeStamp.getHours()
        : `0${nowTimeStamp.getHours()}`;
    const mm =  nowTimeStamp.getMinutes() >= 10
        ? nowTimeStamp.getMinutes()
        : `0${nowTimeStamp.getMinutes()}`;
    const s = nowTimeStamp.getSeconds() >= 10
        ? nowTimeStamp.getSeconds()
        : `0${nowTimeStamp.getSeconds()}`;
    const date = `${m}-${d} ${h}:${mm}:${s}`;
    setPushTimeLabel(date);
  }

  const onMethodChange = e => {
    const data = activeTab == 1 ? DONEDEALMETHOD : WIllDEALMETHOD;
    const key = data.findIndex(v => {
      return v.value == e[0];
    });
    setDisposeCMode(data[key]);
    activeTab == 0 && setRemarks("");
    if (activeTab == 0) {
      let isTempSubmit = false;
      if (isDispose == "false" && key == 0) {
        isTempSubmit = true;
      }
      setPlanCTime(null);
      setDisposeCResult(null);
      setIsSubmit(isTempSubmit);
    } else {
      setIsSubmit(remarks != '');
    }
  };

  const dateChange = e => {
    const dateStr = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
    setPlanCTime({
      label: dateStr,
      value: e
    });
    if (disposeCResult && disposeCMode.value == 2) {
      setIsSubmit(true);
    }
  }

  const onResonsChange = e => {
    const resons = disposeCMode.value == 2 ? WILLRESONS : CANCELRESULT;
    const key = resons.findIndex(v => {
      return v.value == e[0];
    });
    setDisposeCResult(resons[key]);
    setRemarks('');
    if (disposeCMode.value == 2 || disposeCMode.value == 3) {
        const tempIsSubmit =
          disposeCMode.value == 3
            ? resons[key].value == 13
              ? remarks != ""
              : disposeCMode.value == 3
            : resons[key].value == 13
            ? remarks != "" && disposeCMode.value == 2 && planCTime
            : disposeCMode.value == 2 && planCTime;
        setIsSubmit(tempIsSubmit);
    } else {
      setIsSubmit(false);
    }
  }

  const onRemarksChange = e => {
    const value = e.trim();
    setRemarks(value);
    if (activeTab == 1) {
      setIsSubmit(true);
      return;
    }
    if (disposeCResult.value == 13) {
      disposeCMode.value == 2 && planCTime && setIsSubmit(true);
      disposeCMode.value == 3 && setIsSubmit(true);
    }
  };

  const submitClick = e => {
    const params = {
      disposeMode: disposeCMode.value,
      msgid,
      msgseq,
      disposeModeLabel: disposeCMode.label,
    };
    if (activeTab == 1) {
      // 沟通原因
       Object.assign(params, {
         commentResult: remarks,
       });
    } else {
      if ((disposeCResult && disposeCMode.value == 2) || disposeCMode.value == 3) {
        // 补充原因
        Object.assign(params, {
          disposeResult: disposeCResult.value,
          disposeResultLabel: disposeCResult.label
        });
        
        if (disposeCResult.value == 13 && remarks) {
          Object.assign(params, {
            commentResult: remarks
          });
        }
      }
      if (disposeCMode && disposeCMode.value == 2 && planCTime) {
        Object.assign(params, {
          planTime: planCTime.label
        });
      }
    }
    
    submit({ params, index });
  }

  return (
    <div className={styles.orderInfo}>
      {screens == index && <div id="screens"></div>}
      <div className={styles.header}>
        <div className={styles.black}>预警推送</div>
        <div>{pushTimeLabel}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.left}>
            <div
              className={
                isDispose == "true"
                  ? `${styles.title}`
                  : `${styles.title} ${styles.tag}`
              }
            >
              {activeTab == 1 ? "48小时未选择退货方式" : "订单超过48小时未发货"}
            </div>
            <div className={styles.row}>
              <span className={styles.label}>订单编号：</span>
              {orderNo || "--"}
            </div>
            <div className={styles.row}>
              <span className={styles.label}>柜台名称：</span>
              <span className={`${styles.value} ${styles.ellipsis}`}>
                {shoppeName || "--"}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>专属导购：</span>
              {guideName || "无"}
            </div>
          </div>
          {isDispose == "true" ? (
            <img
              style={{ width: "75px", height: "75px" }}
              src={require("assets/images/icon_processed_red.png")}
            />
          ) : (
            <div
              className={`${styles.btn} ${isSubmit ? styles.submit : ""}`}
              onClick={submitClick}
            >
              提交
            </div>
          )}
        </div>
      </div>
      <div className={styles.cellInfo}>
        <div className={styles.cell}>
          <div>{activeTab == 1 ? "审核" : "支付"}时间</div>
          <div>{payTime || "--"}</div>
        </div>
        {isDispose == "false" ? (
          <Picker
            cols={1}
            data={activeTab == 1 ? DONEDEALMETHOD : WIllDEALMETHOD}
            onChange={onMethodChange}
            value={
              disposeCMode ? [disposeCMode.value] : [WIllDEALMETHOD[0].value]
            }
          >
            <div className={styles.cell}>
              <div>处理方式</div>
              <div className={`${styles.text} ${styles.light}`}>
                {disposeCMode ? disposeCMode.label : "请选择"}
              </div>
              <img
                className={styles.extendedRight}
                src={require("assets/images/icon_extended_gray.png")}
              />
            </div>
          </Picker>
        ) : (
          <div className={styles.cell}>
            <div>处理方式</div>
            <div className={styles.label}>{disposeMode || "--"}</div>
          </div>
        )}
        {activeTab == 1 && isDispose == "false" && disposeCMode && (
          <div className={`${styles.cell} ${styles.pding}`}>
            <div className={styles.txt}>沟通结果</div>
            <InputItem
              className={styles.input}
              placeholder="自定义填写"
              maxLength={15}
              onChange={onRemarksChange}
              value={remarks}
            ></InputItem>
          </div>
        )}
        {activeTab == 1 && isDispose == "true" && commentResult && (
          <div className={styles.cell}>
            <div>沟通结果</div>
            <div className={styles.label}>{commentResult || "--"}</div>
          </div>
        )}
        {activeTab == 0 &&
          disposeCMode &&
          disposeCMode.value == 2 &&
          isDispose == "false" && (
            <DatePicker
              mode="date"
              onChange={dateChange}
              format="YYYY-MM-DD"
              value={planCTime ? planCTime.value : minDate}
              minDate={minDate}
              maxDate={maxDate}
            >
              <div className={styles.cell}>
                <div>预计发货时间</div>
                <div className={`${styles.text} ${styles.light}`}>
                  {(planCTime && planCTime.label) || "请选择"}
                </div>
                <img
                  className={styles.extendedRight}
                  src={require("assets/images/icon_extended_gray.png")}
                />
              </div>
            </DatePicker>
          )}

        {activeTab == 0 && isDispose == "true" && planTime && (
          <div className={styles.cell}>
            <div>预计发货时间</div>
            <div className={styles.label}>{planTime || "--"}</div>
          </div>
        )}

        {activeTab == 0 &&
          disposeCMode &&
          (disposeCMode.value == 2 || disposeCMode.value == 3) &&
          isDispose == "false" && (
            <Picker
              cols={1}
              data={disposeCMode.value == 2 ? WILLRESONS : CANCELRESULT}
              onChange={onResonsChange}
              value={
                disposeCResult
                  ? [disposeCResult.value]
                  : disposeCMode.value == 2
                  ? [WILLRESONS[0].value]
                  : [CANCELRESULT[0].value]
              }
            >
              <div className={styles.cell}>
                <div>补充原因</div>
                <div className={`${styles.text} ${styles.light}`}>
                  {disposeCResult ? disposeCResult.label : "请选择"}
                </div>
                <img
                  className={styles.extendedRight}
                  src={require("assets/images/icon_extended_gray.png")}
                />
              </div>
            </Picker>
          )}

        {activeTab == 0 && isDispose == "true" && disposeResult && (
          <div className={styles.cell}>
            <div>补充原因</div>
            <div className={styles.label}>{disposeResult || "--"}</div>
          </div>
        )}

        {activeTab == 0 &&
          disposeCResult &&
          disposeCResult.value == 13 &&
          isDispose == "false" && (
            <div className={`${styles.cell} ${styles.pding}`}>
              <div className={styles.txt}>具体说明</div>
              <InputItem
                className={styles.input}
                placeholder="自定义填写"
                maxLength={15}
                onChange={onRemarksChange}
                value={remarks}
              ></InputItem>
            </div>
          )}
        {activeTab == 0 && isDispose == "true" && commentResult && (
          <div className={styles.cell}>
            <div>具体说明</div>
            <div className={styles.label}>{commentResult || "--"}</div>
          </div>
        )}
      </div>
    </div>
  );
})