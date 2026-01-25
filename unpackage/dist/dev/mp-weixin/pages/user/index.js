"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + CustomTabbar)();
}
const CustomTabbar = () => "../../components/CustomTabbar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const history = common_vendor.ref([
      {
        name: "消费赠送 (购买冰箱)",
        time: "2025-11-22 10:30",
        amount: 1e3
      },
      {
        name: "积分兑换 (电饭煲)",
        time: "2025-11-21 14:05",
        amount: -5e3
      },
      {
        name: "新会员注册",
        time: "2025-11-20 09:00",
        amount: 100
      }
    ]);
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar({ animation: false });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "person-filled",
          size: "45",
          color: "#fff"
        }),
        b: common_vendor.f(history.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.amount > 0 ? "+" : ""),
            d: common_vendor.t(item.amount),
            e: item.amount > 0 ? 1 : "",
            f: item.amount < 0 ? 1 : "",
            g: index
          };
        }),
        c: common_vendor.p({
          active: "user"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-79e6a490"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/index.js.map
