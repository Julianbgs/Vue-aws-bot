<template lang="html">
    <div class="container-scroller">
        <app-header></app-header>
        <div class="container-fluid page-body-wrapper">
            <app-sidebar></app-sidebar>
            <div class="main-panel">
                <div class="content-wrapper">
                    <section class="dashboard">
                        <div class="row">
                            <div class="col-lg-12 grid-margin">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="col-lg-12 grid-margin">
                                            <div class="card">
                                                <div class="card-body d-flex justify-content-center">
                                                    <el-button icon="el-icon-plus" type="primary"
                                                               @click="addUserModal()">
                                                        Create User
                                                    </el-button>
                                                </div>
                                            </div>
                                        </div>
                                        <data-tables
                                                :data="tableUsers"
                                                :filters="filters"
                                                :pagination-props="{ pageSizes: [5, 10, 15] }"
                                                :total="total"
                                                v-loading="loading"
                                                width="100%">
                                            <el-table-column
                                                    prop="username"
                                                    label="User Name"
                                                    custom
                                                    sortable
                                                    width="auto">
                                            </el-table-column>
                                            <el-table-column
                                                    prop="status"
                                                    label="Status"
                                                    custom
                                                    sortable
                                                    width="auto">
                                                <template slot-scope="props">
                                                    <el-tooltip class="item" effect="dark" content="Switch User status"
                                                                placement="top-start">
                                                        <el-switch v-if="props.row.username !== 'superadmin' && props.row.username !== user"
                                                                   v-model="tableUsers[props.row.index].status"
                                                                   active-value="ENABLED"
                                                                   inactive-value="DISABLED"
                                                                   @change="changeStatus($event, props.row.username)"
                                                                   active-color="#13ce66"
                                                                   inactive-color="#ff4949">
                                                        </el-switch>
                                                    </el-tooltip>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                    prop="actions"
                                                    label="Actions"
                                                    width="320">
                                                <template v-if="props.row.username !== 'superadmin' && props.row.username !== user" slot-scope="props">
                                                    <el-tooltip class="item" effect="dark" content="Edit current User"
                                                                placement="top-start">
                                                        <el-button type="primary" icon="el-icon-edit"
                                                                   @click="showEditUserModal(props.row.username)"
                                                                   circle></el-button>
                                                    </el-tooltip>
                                                    <el-tooltip class="item" effect="dark" content="Delete current User"
                                                                placement="top-start">
                                                        <el-button type="danger" icon="el-icon-delete" @click="deleteUser(props.row.username)"
                                                                   circle></el-button>
                                                    </el-tooltip>
                                                </template>
                                                <template  slot-scope="props">
                                                    <el-tooltip class="item" effect="dark" content="Edit current User"
                                                                placement="top-start">
                                                        <el-button v-if="props.row.username !== 'superadmin'" type="primary" icon="el-icon-edit"
                                                                   @click="showEditUserModal(props.row.username)"
                                                                   circle></el-button>
                                                    </el-tooltip>
                                                    <el-tooltip class="item" effect="dark" content="Delete current User"
                                                                placement="top-start">
                                                        <el-button v-if="props.row.username !== 'superadmin' && props.row.username !== user" type="danger" icon="el-icon-delete" @click="deleteUser(props.row.username)"
                                                                   circle></el-button>
                                                    </el-tooltip>
                                                </template>
                                            </el-table-column>
                                        </data-tables>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div id="AddUserModal" class="product-modal" ref="modaAddUser">
                        <div class="pass-modal__content">
                            <span class="close product-modal__close" id="closeAddUserModal">x</span>
                            <form action="#" @submit.prevent="addNewUser" autocomplete="off" id="userForm">
                                <div class="modal-body product-modal__body">
                                    <div id="AddUserModalResult" class="form-group">
                                        <div class="form-group">
                                            <label>User Name</label>
                                            <input type="text" name="username" v-model="username" minlength="3" maxlength="30" value=" "
                                                   id="addUserName" required class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label>Password</label>
                                            <input autocomplete="false" v-model="password" type="password" minlength="7" maxlength="9"
                                                   id="addNewPass" required class="form-control">
                                            <a href="#" id="showNewPass" class="mdi mdi-eye pass--btn"></a>
                                        </div>
                                        <div class="form-group">
                                            <label>Confirm Password</label>
                                            <input autocomplete="false" type="password" minlength="7" maxlength="9"
                                                   id="addConfPass" required class="form-control">
                                            <a href="#" id="showConfPass" class="mdi mdi-eye pass--btn"></a>
                                        </div>
                                    </div>
                                    <div class="modal-footer product-modal__footer">
                                        <button type="submit" class="btn btn-primary"
                                                id="submitAddUserModal">Confirm
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div id="updateUserModal" class="product-modal" ref="modal">
                        <div class="pass-modal__content">
                            <span class="close product-modal__close" id="closeUserModal">x</span>
                            <div class="modal-body product-modal__body">
                                <div id="UserModalResult" class="form-group">
                                    <div class="form-group">
                                        <label>User Name</label>
                                        <input type="text" name="username" minlength="3" maxlength="30" value=""
                                               id="editUserName" required class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label>Password</label>
                                        <input autocomplete="false" type="password" minlength="7" maxlength="9"
                                               id="editNewPass" required class="form-control">
                                        <a href="#" id="showEditNewPass" class="mdi mdi-eye pass--btn"></a>
                                    </div>
                                    <div class="form-group">
                                        <label>Confirm Password</label>
                                        <input autocomplete="false" type="password" minlength="7" maxlength="9"
                                               id="editConfPass" required class="form-control">
                                        <a href="#" id="showEditConfPass" class="mdi mdi-eye pass--btn"></a>
                                    </div>
                                </div>
                                <div class="modal-footer product-modal__footer">
                                    <button type="submit" class="btn btn-primary" id="submitUserModal">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <app-footer></app-footer>
            </div>
        </div>
    </div>
</template>

<script>
    import AppHeader from '@/components/AppHeader';
    import AppSidebar from '@/components/AppSidebar';
    import AppFooter from '@/components/AppFooter';

    export default {
        name: "users",
        data() {
            return {
                user: '',
                columns: [
                    'username',
                    'status',
                    'actions'
                ],
                tableUsers: [],
                filters: [
                    {
                        value: '',
                        search_prop: 'name'
                    }
                ],
                total: 0,
                loading: true
            }
        },
        components: {
            AppHeader,
            AppSidebar,
            AppFooter
        },
        mounted() {
            if (localStorage.username) {
                this.user = localStorage.username;
            }
            this.loadUsers();
        },
        methods: {
            loadUsers() {
                this.$http.get('/users').then((response) => {
                    this.loading = false;
                    this.tableUsers = response.data;
                    // console.log(response.data);
                    this.tableUsers.forEach((item, index) => {
                        this.tableUsers[index].index = index;
                    });
                }).catch((error) => {
                    console.log(error);
                });
            },
            addUserModal: function () {
                let modal = document.getElementById('AddUserModal');
                let close = document.getElementById("closeAddUserModal");
                let submit = document.getElementById('submitAddUserModal');
                document.querySelectorAll('#addUserName, #addNewPass, #addConfPass').forEach(el => el.value = '');
                submit.disabled = false;

                modal.classList.remove('modal__close');
                modal.setAttribute("style", "opacity: 1; z-index:1032;");
                close.onclick = function (v) {
                    modal.setAttribute("style", "opacity: 0; z-index:-1;");
                };
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.setAttribute("style", "opacity: 0; z-index:-1;");
                    }
                };
                let triggerPass = document.getElementById('showNewPass');
                let triggerConfPass = document.getElementById('showConfPass');
                let newPass = document.getElementById('addNewPass');
                let confPass = document.getElementById('addConfPass');
                triggerPass.onclick = function (event) {
                    event.preventDefault();
                    if (newPass.type === "password") {
                        newPass.type = "text";
                    } else {
                        newPass.type = "password";
                    }
                };
                triggerConfPass.onclick = function (event) {
                    event.preventDefault();
                    if (confPass.type === "password") {
                        confPass.type = "text";
                    } else {
                        confPass.type = "password";
                    }
                };
                submit.onclick = function (v, event) {
                    if (newPass.value != confPass.value) {
                        event.preventDefault();
                        v.$notify({
                            title: 'Warning',
                            message: 'Passwords do not match!',
                            type: 'error'
                        });
                    }
                }.bind(submit, this)
            },
            addNewUser: function () {
                let newUser = {
                    username: this.username,
                    password: this.password
                };
                let submitAddUser = document.getElementById('submitAddUserModal');
                submitAddUser.disabled = true;

                if ( this.tableUsers.find(curUser => curUser.username === newUser.username) ) {
                    this.$notify.error({
                        showClose: true,
                        title: 'Error',
                        message: 'User already exists!'
                    });
                    submitAddUser.disabled = false;
                }
                this.$http.put('/users', newUser).then((response) => {
                    submitAddUser.disabled = true;
                    this.$nextTick(() => {
                        this.$refs.modaAddUser.classList.add('modal__close');
                        this.$refs.modaAddUser.setAttribute("style", "opacity: 0; z-index:-1;");
                        this.loadUsers();
                        this.$notify({
                            title: 'Success',
                            message: 'New user created!',
                            type: 'success'
                        });
                        this.loading = true;
                    });
                }).catch((error) => {
                    console.log(error)
                });
            },
            showEditUserModal: function (edit) {
                let editUser = this.tableUsers.find((item) => item.username === edit);
                let targetUserIndex = this.tableUsers.findIndex((item) => item.username === edit);
                let modal = document.getElementById('updateUserModal');
                let close = document.getElementById("closeUserModal");
                let submit = document.getElementById('submitUserModal');
                let userName = document.getElementById('editUserName');
                submit.disabled = false;
                userName.value = editUser.username;

                modal.classList.remove('modal__close');
                modal.setAttribute("style", "opacity: 1; z-index:1032;");
                close.onclick = function () {
                    modal.setAttribute("style", "opacity: 0; z-index:-1;");
                    document.querySelectorAll('#editUserName, #editNewPass, #editConfPass').forEach(el => el.value = '');

                };
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.setAttribute("style", "opacity: 0; z-index:-1;");
                        document.querySelectorAll('#editUserName, #editNewPass, #editConfPass').forEach(el => el.value = '');
                    }
                };
                let triggerPass = document.getElementById('showEditNewPass');
                let triggerConfPass = document.getElementById('showEditConfPass');
                let newPass = document.getElementById('editNewPass');
                let confPass = document.getElementById('editConfPass');
                triggerPass.onclick = function (event) {
                    event.preventDefault();
                    if (newPass.type === "password") {
                        newPass.type = "text";
                    } else {
                        newPass.type = "password";
                    }
                };
                triggerConfPass.onclick = function (event) {
                    event.preventDefault();
                    if (confPass.type === "password") {
                        confPass.type = "text";
                    } else {
                        confPass.type = "password";
                    }
                };
                submit.onclick = function (v, event) {
                    if (newPass.value == confPass.value) {
                        v.changeUser(targetUserIndex);
                    } else {
                        event.preventDefault();
                        v.$notify({
                            title: 'Warning',
                            message: 'Passwords do not match!',
                            type: 'error'
                        });
                    }
                }.bind(submit, this)
            },
            deleteUser: function (user) {
                let deleteUser = this.tableUsers.find((item) => item.username === user);
                let userId = deleteUser.id;
                this.$http.delete(`/users/${userId}`).then((response) => {
                    this.$notify({
                        title: 'Success',
                        message: 'User was deleted!',
                        type: 'success'
                    });
                    this.loadUsers();
                }).catch((error) => {
                    console.log(error);
                });
                this.loading = true;
            },
            changeStatus: function (newStatus, targetUsername) {
                let changedUser = this.tableUsers.find((item) => item.username === targetUsername);
                let changedUserIndex = this.tableUsers.findIndex((item) => item.username === targetUsername);
                let val = newStatus;
                let info = {};
                info['targetUsername'] = changedUser.username;
                if ("ENABLED" === val) {
                    info['newStatus'] = 'ENABLED';
                    this.$http.patch('/users', info).then((response) => {
                        this.tableUsers[changedUserIndex].status = 'ENABLED';
                    }).catch((error) => {
                        console.log(error)
                    });
                }
                if ("DISABLED" === val) {
                    info['newStatus'] = 'DISABLED';
                    this.$http.patch('/users', info).then((response) => {
                        this.tableUsers[changedUserIndex].status = 'DISABLED';
                    }).catch((error) => {
                        console.log(error)
                    });
                }
            },
            changeUser: function (targetUserIndex) {
                let paramsUser = {
                    username: document.getElementById('editUserName').value,
                    newPass: document.getElementById('editNewPass').value,
                    status: 'ENABLED'
                };
                let editInfo = {};
                // editInfo["action"] = 'updateUser';
                editInfo['targetUsername'] = this.tableUsers[targetUserIndex].username;
                editInfo['newUsername'] = paramsUser.username;
                if ( paramsUser.newPass.length > 0 ) {
                    editInfo['newPassword'] = paramsUser.newPass;
                }
                let submit = document.getElementById('submitUserModal');
                submit.disabled = true;


                this.$http.patch('/users', editInfo).then((response) => {
                    this.tableUsers[targetUserIndex].username = paramsUser.username;
                    this.$nextTick(() => {
                        this.$refs.modal.classList.add('modal__close');
                        this.$refs.modal.setAttribute("style", "opacity: 0; z-index:-1;");
                        this.loadUsers();
                    });
                }).catch((error) => {
                    console.log(error)
                });
            },
        }
    }
</script>

<style scoped>

</style>