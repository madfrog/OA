<style>
.showBtn {
  background: none;
  border: none;
  font-size: 23px;
  color: white;
  cursor: pointer;
}
</style>
<template>
  <el-container class="wrapper first_container">
    <yj-dialog
      :modal="dialog.modal"
      :width="dialog.width"
      :title="dialog.title"
      :dialogVisible="dialog.visible"
    >
      <template slot="dialog-content">
        <el-form :model="user" size="mini" label-width="80px">
          <el-form-item label="旧密码">
            <el-input type="password" v-model="user.oldPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="user.newPwd"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center" class="dialog-footer">
          <el-button size="mini" @click="cancelCargoBtn">取 消</el-button>
          <el-button size="mini" type="primary" @click="saveCargoBtn">确 定</el-button>
        </div>
      </template>
    </yj-dialog>
    <el-header :style="bg">
      <el-row>
        <el-col :span="left_lager_head_span">
          <div v-if="!isCollapse" class="left-lager-head">
            <img class="logo" src="@/assets/kafei_white.png"/>
            <span class="titleMsg">{{ blogName }}</span>
          </div>
          <div v-else class="left-mini-head">
            <img class="logo" src="@/assets/kafei_white.png"/>
          </div>
        </el-col>
        <el-col :span="showBtnSpan">
          <div class="showBtn">
            <i
              size="mini"
              v-if="!isCollapse"
              @click="showHide(isCollapse)"
              class="el-icon-s-fold"
            ></i>
            <i
              size="mini"
              v-else
              @click="showHide(isCollapse)"
              class="el-icon-s-unfold"
            ></i>
          </div>
        </el-col>
        <el-col style="text-align: right" :span="24 - left_lager_head_span - showBtnSpan">
          <div class="right_operate_main">
            <div class="right_operate">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <div class="user"></div>
                  <span class="userName">欢迎您，{{ loginUser }}</span>
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-turn-off" @click.native="updatePwd"
                  >修改密码
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <div class="outSys">
              <el-button type="text" icon="el-icon-switch-button" @click.native="logout">
                退出登陆
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="main_container">
      <el-aside :width="asideWidth">
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :unique-opened="true"
          :collapse-transition="true"
          :router="false"
          :default-active="defaultActive"
          :default-openeds="defaultOpeneIds"
          @select="menuSelect"
          @open="handOpen"
        >
          <!-- text-color="#fff" -->
          <!-- active-text-color="#409eff" -->
          <template v-if="menuExitRole">
            <template v-for="(menu, idx) in menus">
              <!-- 第一级菜单，不带第二层的，也带链接的 不是外链-->
              <template
                v-if="
                  menu.parentId == 0 &&
                  !menu.outJoin &&
                  (menu.href != null || menu.href != '') &&
                  menu.type == 2 &&
                  menu.children.length == 0 &&
                  menu.role.indexOf(role) >= 0
                "
              >
                <el-menu-item @click="jumpTo(menu)" :key="idx" :index="menu.perName">
                  <i :class="menu.icon"></i>
                  <span slot="title">{{ menu.perName }}</span>
                </el-menu-item>
              </template>

              <!-- 第一级菜单，不带第二层的，是外链-->
              <template
                v-if="
                  menu.parentId == 0 &&
                  menu.outJoin &&
                  (menu.href != null || menu.href != '') &&
                  menu.type == 2 &&
                  menu.children.length == 0
                "
              >
                <el-link
                  :underline="false"
                  target="_blank"
                  style="color: white; width: 100%; margin: 0"
                  :key="idx"
                  :href="menu.href"
                  v-if="menu.role.indexOf(role) >= 0"
                >
                  <el-menu-item :index="menu.perName">
                    <i :class="menu.icon"></i>
                    {{ menu.perName }}
                    <span style="font-size: 10px">(外链)</span>
                  </el-menu-item>
                </el-link>
              </template>

              <!-- 二级菜单，第一层不带链接的 -->
              <el-submenu
                v-if="
                  menu.parentId == 0 && menu.type == 1 && menu.role.indexOf(role) >= 0
                "
                :key="idx"
                :index="menu.perName"
              >
                <template slot="title">
                  <i :class="menu.icon"></i>
                  <span @click="jumpTo(menu)" slot="title">{{ menu.perName }}</span>
                </template>

                <template v-for="(chmenu, idxx) in menu.children">
                  <!-- 内链 -->
                  <template v-if="!chmenu.outJoin && chmenu.role.indexOf(role) >= 0">
                    <el-menu-item
                      :key="idxx"
                      @click="jumpTo(chmenu)"
                      :index="chmenu.perName"
                    >
                      <i :class="chmenu.icon"></i>
                      {{ chmenu.perName }}
                    </el-menu-item>
                  </template>

                  <!-- 外链 -->
                  <template v-else>
                    <el-link
                      :underline="false"
                      target="_blank"
                      style="color: white"
                      :key="idxx"
                      :href="chmenu.href"
                      v-if="chmenu.role.indexOf(role) >= 0"
                    >
                      <el-menu-item :index="chmenu.perName">
                        <i :class="chmenu.icon"></i>
                        {{ chmenu.perName }}
                        <span style="font-size: 10px">(外链)</span>
                      </el-menu-item>
                    </el-link>
                  </template>
                </template>
              </el-submenu>
            </template>
          </template>

          <template v-else>
            <template v-for="(menu, idx) in menus">
              <!-- 第一级菜单，不带第二层的，也带链接的 不是外链-->
              <template
                v-if="
                  menu.parentId == 0 &&
                  !menu.outJoin &&
                  (menu.href != null || menu.href != '') &&
                  menu.type == 2 &&
                  menu.children.length == 0
                "
              >
                <el-menu-item @click="jumpTo(menu)" :key="idx" :index="menu.perName">
                  <i :class="menu.icon"></i>
                  <span slot="title">{{ menu.perName }}</span>
                </el-menu-item>
              </template>

              <!-- 第一级菜单，不带第二层的，是外链-->
              <template
                v-if="
                  menu.parentId == 0 &&
                  menu.outJoin &&
                  (menu.href != null || menu.href != '') &&
                  menu.type == 2 &&
                  menu.children.length == 0
                "
              >
                <el-link
                  :underline="false"
                  target="_blank"
                  style="color: white; width: 100%; margin: 0"
                  :key="idx"
                  :href="menu.href"
                >
                  <el-menu-item :index="menu.perName">
                    <i :class="menu.icon"></i>
                    {{ menu.perName }}
                    <span style="font-size: 10px">(外链)</span>
                  </el-menu-item>
                </el-link>
              </template>

              <!-- 二级菜单，第一层不带链接的 -->
              <el-submenu
                v-if="menu.parentId == 0 && menu.type == 1"
                :key="idx"
                :index="menu.perName"
              >
                <template slot="title">
                  <i :class="menu.icon"></i>
                  <span @click="jumpTo(menu)" slot="title">{{ menu.perName }}</span>
                </template>

                <template v-for="(chmenu, idxx) in menu.children">
                  <!-- 内链 -->
                  <template v-if="!chmenu.outJoin">
                    <el-menu-item
                      :key="idxx"
                      @click="jumpTo(chmenu)"
                      :index="chmenu.perName"
                    >
                      <i :class="chmenu.icon"></i>
                      {{ chmenu.perName }}
                    </el-menu-item>
                  </template>

                  <!-- 外链 -->
                  <template v-else>
                    <el-link
                      :underline="false"
                      target="_blank"
                      style="color: white"
                      :key="idxx"
                      :href="chmenu.url"
                    >
                      <el-menu-item :index="chmenu.perName">
                        <i :class="chmenu.icon"></i>
                        {{ chmenu.perName }}
                        <span style="font-size: 10px">(外链)</span>
                      </el-menu-item>
                    </el-link>
                  </template>
                </template>
              </el-submenu>
            </template>
          </template>
        </el-menu>
      </el-aside>
      <el-container class="center_first">
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<style scoped></style>
<script>
let _this = {};
import {getMenus} from "@/menu.js";

let config = require("@/config.js").config;

export default {
  data() {
    return {
      bg: {
        backgroundImage: "url(" + require("@/assets/nav-bg.png") + ")",
      },
      loading: false,
      dialog: {
        width: "40%",
        title: "信息修改",
        visible: false,
        modal: true,
      },
      left_lager_head_span: 3,
      showBtnSpan: 5,
      user: {
        id: "",
        newPwd: "",
        oldPwd: "",
      },
      role: "user",

      isCollapse: false,
      asideWidth: "200px",
      loginUserRole: "",
      loginUser: "",
      blogName: "办公OA",

      defaultActive: config.routerIndex.name,
      defaultOpeneIds: [],
      menus: [],
      menCookieKey: {
        defaultActive: "meun-default-active",
        defaultOpeneIds: "meun-default-openeds",
        currentPath: "menu-currentPath",
        tab: "tabListEvent",
        defaultOpenIdsEvent: "defaultOpeneIdsEvent",
        menuList: "menuList",
      },
      menuExitRole: true, // 菜单是否有角色
      URL: {
        menu: "/permission/userMenuTree",
        blog: "http://thisforyou.cn:180/blog/",
        note: "http://thisforyou.cn:180/",
        updatePwd: "/user/updatePwd",
        logOut: "/logout",
      },
    };
  },

  components: {},
  created() {
    _this = this;
    this.menuExitRole = config.menuExitRole;
    this.settingMenu();
    this.getLoginUser();
  },
  mounted() {
    // 菜单还原
    this.restoreMenu();

    // 监听tab栏的点击，更新左侧菜单的展开
    this.$EventBus.$on(this.menCookieKey.defaultOpenIdsEvent, (defaultOpenIds) => {
      this.defaultOpeneIds = defaultOpenIds;
      if (defaultOpenIds.length > 1) {
        this.defaultActive = defaultOpenIds[1];
      } else {
        this.defaultActive = defaultOpenIds[0];
      }
    });
  },
  watch: {
    // 路由监听，当点击左侧菜单的时候，往tab栏加一个
    $route(to, from) {
      this.pushTab(to);
      this.$cookies.set(this.menCookieKey.currentPath, to.fullPath, "30d");
    },
  },
  methods: {
    // 发送数据到 菜单tab栏
    pushTab(to) {
      let tab = this.$cookies.get(this.menCookieKey.tab);
      // 非空校验
      let arr = [null, undefined, ""];
      let index = arr.indexOf(tab);
      if (index >= 0) {
        tab = [];
      } else {
        tab = JSON.parse(tab);
      }
      let isExit = false;

      // 是否存在
      for (let i = 0; i < tab.length; i++) {
        let menu = tab[i];
        if (menu.name == to.name) {
          isExit = true;
          break;
        }
      }

      if (!isExit) {
        let m = {
          path: to.fullPath,
          name: to.name,
        };
        tab.push(m);
      }
      this.$cookies.set(this.menCookieKey.tab, JSON.stringify(tab), "30d");
      // 通知tab栏更新
      this.$EventBus.$emit(this.menCookieKey.tab, tab);
    },
    // 展开指定的 sub-menu
    handOpen() {
    },

    // 左侧菜单栏跳转
    jumpTo(menu) {
      if (menu.type == 1) {
        return;
      }
      if (!menu.outJoin) {
        if (menu.router == "") {
          this.$warning("💪 开发中");
          return;
        }
        this.$router.push(menu.router);
      }
    },

    // 获取菜单列表
    getMenuList(callback) {
      getMenus(callback);
    },
    settingMenu() {
      this.getMenuList((menus) => {
        this.menus = menus;
      });
    },
    updatePwd() {
      this.dialog.visible = true;
      // this.$warning("努力💪君，开发中");
    },

    saveCargoBtn() {
      let url = this.URL.updatePwd;
      this.$put(url, this.user).then((res) => {
        if (res.R) {
          this.$success("修改成功，需要重新登陆");
          this.$router.push(config.loginPage);
        }
      });
    },
    cancelCargoBtn() {
      this.dialog.visible = false;
    },
    showHide() {
      if (!this.isCollapse) {
        this.isCollapse = true;
        this.left_lager_head_span = 1;
        this.showBtnSpan = 1;
        this.asideWidth = "64px";
      } else {
        this.left_lager_head_span = 3;
        this.showBtnSpan = 5;
        this.isCollapse = false;
        this.asideWidth = "200px";
      }
    },
    logout() {
      this.$removeToken();

      // 移除菜单缓存
      this.$cookies.remove(this.menCookieKey.defaultActive);
      this.$cookies.remove(this.menCookieKey.defaultOpeneIds);
      this.$cookies.remove(this.menCookieKey.currentPath);
      this.$cookies.remove(this.menCookieKey.tab);


      // 发送退出请求
      this.$post(this.URL.logOut, {}).then((res) => {
      });


      // 跳转到登陆页
      this.$router.push({
        path: config.loginPage,
      });

    },
    // 点击菜单
    menuSelect(index, indexPath) {
      this.defaultActive = index;

      this.$EventBus.$emit(this.menCookieKey.defaultActive, index);

      // 选中的菜单
      this.$cookies.set(this.menCookieKey.defaultActive, index, "30d");
      // 展开的菜单列表
      this.$cookies.set(this.menCookieKey.defaultOpeneIds, indexPath.join(","), "30d");
    },

    // 还原原来展开的菜单
    restoreMenu() {
      // 展开的菜单
      let openIds = this.$cookies.get(this.menCookieKey.defaultOpeneIds);
      if (openIds != undefined && openIds != null) {
        this.defaultOpeneIds = openIds.split(",");
      }

      // 当前选中的菜单
      let active = this.$cookies.get(this.menCookieKey.defaultActive);
      if (active != undefined && active != null) {
        this.defaultActive = active;
      }
      // 当前路由页面
      let currentPath = this.$cookies.get(this.menCookieKey.currentPath);
      if (currentPath == null || currentPath == undefined || currentPath == "undefined") {
        currentPath = config.routerIndex.path
      }
      this.pushTab({name: config.routerIndex.name, fullPath: config.routerIndex.path, isHome: true})
      // 路由
      this.$router.push(currentPath);
    },
    // 获取用户信息
    getLoginUser() {
      let user = this.$getUser();
      if (user != null && user != undefined && user != "") {
        this.loginUser = user.loginName;
        this.role = user.role;
      }
    },
  },
};
</script>
<style lang="less" scope>
.wrapper {
  height: 100vh;

  .main_container,
  .center_first {
    height: 92vh !important;
    // display: flex;
    // flex-direction: column;
  }

  .el-submenu__icon-arrow {
    font-weight: 800;
    color: rgba(0, 0, 0, 0.65);
  }

  .el-main {
    padding-top: 0;
    padding: 0 !important;
  }

  .el-aside {
    height: 100%;
    color: rgba(0, 0, 0, 0.65);
    text-align: left;
  }

  .el-header {
    height: 6vh !important;
    line-height: 6vh;
    color: white;
    border-bottom: 1px solid #ebebeb;
    background: #1890ff;
  }

  .el-menu-vertical-demo {
    flex-shrink: 0;
  }

  .el-menu--collapse,
  .el-menu-vertical-demo {
    height: 100%;
    overflow-x: hidden !important;
  }

  .el-menu {
    border-right: none !important;
    overflow-x: hidden !important;
  }

  .right_operate_main {
    display: flex;
    color: white;
    text-align: right !important;
    float: right;

    .outSys,
    .right_operate {
      padding: 0 10px;
      height: 6vh;
    }

    .client_link {
      padding: 0 10px;
      height: 6vh;
      cursor: pointer;
    }

    .outSys:hover,
    .right_operate:hover,
    .client_link:hover {
      background-color: rgb(103, 179, 252);
    }

    .outSys .el-button {
      color: white;
      font-size: 15px;
    }

    .el-dropdown-link {
      color: white;
      height: 6vh;
      cursor: pointer;
      width: 100%;
      display: flex;
      align-items: center;

      .user {
        width: 25px;
        height: 25px;
        border-radius: 30px;
        position: relative;
        background: white;
        margin-right: 10px;
      }

      .userName {
        position: relative;
        font-size: 15px;
        position: relative;
        font-weight: 500;
        color: white;
      }
    }
  }

  .left-lager-head {
    line-height: 6vh;
    display: flex;
    align-content: center;
    .logo {
      width: 18%;
      height: 18%;
      position: relative;
      top:4px;
    }

    .titleMsg {
      font-size: 18px;
      font-weight: 500;
      color: #fff !important;
      position: relative;
      padding-left: 10px;
    }
  }

  .left-mini-head {
    line-height: 6vh;
    align-content: center;
    .logo {
      width: 50%;
      height: 50%;
      position: relative;
      top:4px;
    }

    .titleMsg {
      color: #fff !important;
      position: relative;
      padding-left: 10px;
    }
  }

  // 7----------------------------------------------------
  // 左侧菜单栏的 一整块背景颜色
  .el-menu-vertical-demo,
  .el-aside {
    //background-color: #409EFF;//rgb(37, 49, 68);
    box-shadow: 0 10px 8px rgba(0, 0, 0, 0.15);
    transition: background 0.3s, width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
  }

  .ul li.el-menu-item {
    color: black;
    //background-color: rgb(23, 33, 49);
  }

  //   // 展开的二级菜单背景色
  //   .el-menu--inline li.el-menu-item {
  //     padding-left: 40px !important;
  //     //background-color: #409EFF;// rgb(23, 33, 49);
  //   }

  // 被选中的菜单颜色
  .el-menu--inline li.is-active,
  .el-menu-item.is-active {
    border-right: 2px solid #1890ff;
    color: #1890ff; //#409eff;
    background-color: rgb(231, 247, 255);
  }

  // .el-submenu__title {
  // border-right: none !important;
  //background-color: rgb(37, 49, 68) !important;
  // }

  //   // 鼠标悬停颜色 一级菜单：有二级菜单的
  //   .el-submenu__title:hover {
  //     background-color: rgb(37, 49, 68);
  //   }

  //   // 二级菜单悬停颜色
  //   .el-menu--inline li.el-menu-item:hover {
  //     background-color: rgb(12, 14, 19); // 深
  //     border-right: 4px solid #409eff;
  //     color: #409eff !important;
  //   }

  //   // 一级菜单悬停颜色 就是没有二级菜单的一级连接菜单
  //   .el-menu-item:hover {
  //     background-color: rgb(12, 14, 19); // 深
  //     border-right: 4px solid #409eff;
  //     color: #409eff !important;
  //   }
  // }

  // // 这个是菜单缩小后的
  // .el-menu--vertical {
  //   .el-menu--popup {
  //     background-color: rgb(37, 49, 68) !important;
  //   }
  //   .el-menu-item.is-active {
  //     border-right: 4px solid #409eff;
  //     color: #409eff;
  //     background-color: rgb(12, 14, 19);
  //   }
  //   li.el-menu-item:hover {
  //     background-color: rgb(12, 14, 19); // 深
  //     border-right: 4px solid #409eff;
  //     color: #409eff !important;
  //   }
}

// .el-link--inner {
//   width: 100%;
// }
</style>
