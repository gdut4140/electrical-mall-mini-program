"use strict";
const common_vendor = require("../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "CustomTabbar",
  props: {
    active: {
      type: String,
      default: "home"
    }
  },
  setup(__props) {
    const props = __props;
    const items = [
      { key: "home", text: "全量商品", icon: "home", page: "/pages/index/index" },
      { key: "points", text: "积分商城", icon: "gift", page: "/pages/points-mall/index" },
      { key: "user", text: "个人中心", icon: "person", page: "/pages/user/index" }
    ];
    const switchTo = (url, key) => {
      if (key === props.active)
        return;
      common_vendor.index.switchTab({ url });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(items, (item, k0, i0) => {
          return {
            a: "a32bde3b-0-" + i0,
            b: common_vendor.p({
              type: item.icon,
              size: "26",
              color: item.key === __props.active ? "#0A5CE5" : "#7A7E83"
            }),
            c: common_vendor.t(item.text),
            d: item.key,
            e: item.key === __props.active ? 1 : "",
            f: common_vendor.o(($event) => switchTo(item.page, item.key), item.key)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a32bde3b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/CustomTabbar.js.map
