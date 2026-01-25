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
    const categories = common_vendor.ref(["全部", "电视", "冰箱", "空调", "洗衣机", "生活电器"]);
    const products = common_vendor.ref([
      {
        title: "XX品牌 8K超高清智能电视 75英寸",
        price: "8999",
        bgColor: "#F56C6C"
        // Reddish
      },
      {
        title: "XX品牌 变频节能立式空调 3匹",
        price: "4599",
        bgColor: "#4CD964"
        // Greenish
      },
      {
        title: "XX品牌 智能滚筒洗衣机 10kg",
        price: "3299",
        bgColor: "#5AC8FA"
        // Bluish
      },
      {
        title: "XX品牌 双门冰箱 450L",
        price: "2899",
        bgColor: "#FF9500"
        // Orangish
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
            a: "96311848-4-" + i0,
            b: item.bgColor,
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.price),
            e: index
          };
        }),
        g: common_vendor.p({
          type: "image",
          size: "60",
          color: "#fff"
        }),
        h: common_vendor.p({
          active: "home"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
