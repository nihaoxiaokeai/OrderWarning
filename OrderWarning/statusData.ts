// 处理方式--未发货
const WIllDEALMETHOD = [
  {
    label: "确定发货",
    value: 1
  },
  {
    label: "延迟发货",
    value: 2
  },
  {
    label: "取消订单",
    value: 3
  }
];

// 处理方式--退货
const DONEDEALMETHOD = [
  {
    label: "电话联系顾客",
    value: 4
  },
  {
    label: "微信联系顾客",
    value: 5
  }
];

// 补充原因 --未发货
const WILLRESONS = [
  {
    label: "商品断码缺货",
    value: 6
  },
  {
    label: "品牌统一发货，品牌尚未反馈快递信息",
    value: 7
  },
  {
    label: "预售商品，暂未到发货时间",
    value: 8
  },
  {
    label: "等待顾客通知发货",
    value: 9
  },
  {
    label: "其它",
    value: 13
  }
];

// 取消订单--原因
const CANCELRESULT = [
  {
    label: "顾客不想要了/不喜欢了",
    value: 10
  },
  {
    label: "缺货，顾客不愿意等待",
    value: 11
  },
  {
    label: "质量问题",
    value: 12
  },
  {
    label: "其它",
    value: 13
  }
];

const REPORTERROR = {
  sumName: "orderWarnDailyDetailSum",
  listName: "orderWarnDailyDetailList",
  title: [
    {
      key: "dataTypeName",
      name: "",
      width: 100
    },
    {
      key: "oneUnfilled",
      name: "24小时未发货",
      width: 85
    },
    {
      key: "twoUnfilled",
      name: "48小时未发货",
      width: 85
    },
    {
      key: "sevenPick",
      name: "7天未自提",
      width: 85
    },
    {
      key: "oneCheck",
      name: "24小时未审核",
      width: 85
    },
    {
      key: "fiveDispose",
      name: "5天未处理",
      width: 85
    },
    {
      key: "twochose",
      name: "48小时未选择",
      width: 85
    }
  ]
};

export {
  CANCELRESULT,
  WIllDEALMETHOD,
  DONEDEALMETHOD,
  WILLRESONS,
  REPORTERROR
};
