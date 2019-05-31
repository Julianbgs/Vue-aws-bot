<template lang="html">
    <section class="app-sidebar">
        <div id="sidebarMenu" class="sidebar sidebar-offcanvas">
            <ul class="nav">
                <li class="nav-item nav-profile">
                    <!--<div class="nav-link">-->
                        <!--<div class="profile-name">-->
                            <!--<p class="name">Superadmin</p>-->
                            <!--<p class="designation">Admin</p>-->
                        <!--</div>-->
                    <!--</div>-->
                </li>
            </ul>
            <el-menu class="el-menu-vertical-demo">
                <el-menu-item index="1">
                    <router-link to="/">
                        <i class="el-icon-menu"></i>
                        <span>Task runs</span>
                    </router-link>
                </el-menu-item>
                <el-menu-item index="2">
                  <router-link to="/tasks">
                    <i class="el-icon-menu"></i>
                    <span>Task management</span>
                 </router-link>
                </el-menu-item>
                <el-menu-item index="3">
                  <router-link to="/credentials">
                    <i class="el-icon-menu"></i>
                    <span>Credentials</span>
                    </router-link>
                </el-menu-item>
                <el-menu-item index="4">
                    <router-link to="/users">
                        <i class="el-icon-menu"></i>
                        <span>User management</span>
                    </router-link>
                </el-menu-item>
            </el-menu>
        </div>
    </section>
</template>

<script>
    export default {
        name: "app-sidebar",
        data() {
            return {

            }
        }
    }
</script>

<style scoped>

</style>