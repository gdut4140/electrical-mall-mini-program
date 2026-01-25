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
    const currentCategory = common_vendor.ref(0);
    const categories = common_vendor.ref(["全部", "厨房电器", "生活电器", "个护健康"]);
    const products = common_vendor.ref([
      {
        title: "高端智能电饭煲 5L",
        points: "5000",
        bgColor: "#FDD835"
        // Yellow
      },
      {
        title: "多功能早餐机",
        points: "2500",
        bgColor: "#FB8C00"
        // Orange
      },
      {
        title: "水果榨汁机",
        points: "2500",
        bgColor: "#bbf1a9"
        //
      },
      {
        title: "面包机",
        points: "2500",
        bgColor: "#e43c2f"
        // Orange
      }
    ]);
    const changeCategory = (index) => {
      currentCategory.value = index;
    };
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar({ animation: false });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "search",
          size: "18",
          color: "#999"
        }),
        b: common_vendor.p({
          type: "tune",
          size: "24",
          color: "#666"
        }),
        c: common_vendor.f(categories.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: currentCategory.value === index ? 1 : "",
            d: common_vendor.o(($event) => changeCategory(index), index)
          };
        }),
        d: common_vendor.p({
          type: "up",
          size: "10",
          color: "#999"
        }),
        e: common_vendor.p({
          type: "down",
          size: "10",
          color: "#999"
        }),
        f: common_vendor.f(products.value, (item, index, i0) => {
          return {
            a: "7598e588-4-" + i0,
            b: item.bgColor,
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.points),
            e: index
          };
        }),
        g: common_vendor.p({
          type: "image",
          size: "60",
          color: "#333"
        }),
        h: common_vendor.p({
          active: "points"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/points-mall/index.js.map
