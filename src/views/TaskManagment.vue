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
                                                               @click="openTaskModal()">
                                                        Add New Task
                                                    </el-button>
                                                </div>
                                            </div>
                                        </div>
                                        <data-tables
                                                :data="tableTaskData"
                                                v-loading="loading"
                                                width="100%">
                                            <el-table-column
                                                    prop="name"
                                                    label="Task Name"
                                                    custom
                                                    width="auto">
                                            </el-table-column>
                                            <el-table-column
                                                    prop="actions"
                                                    label="Actions"
                                                    width="320">
                                                <template slot-scope="props">
                                                    <el-tooltip class="item" effect="dark" content="Run current task"
                                                                placement="top-start">
                                                        <el-button type="success" icon="el-icon-caret-right"
                                                                   circle></el-button>
                                                    </el-tooltip>
                                                    <!--<el-tooltip class="item" effect="dark" content="Edit current task"-->
                                                    <!--placement="top-start">-->
                                                    <!--<el-button type="primary" icon="el-icon-edit" circle></el-button>-->
                                                    <!--</el-tooltip>-->
                                                    <el-tooltip class="item" effect="dark" content="Delete current task"
                                                                placement="top-start">
                                                        <el-button type="danger" @click="deleteTask(props.row.name)" icon="el-icon-delete"
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
                </div>
                <app-footer></app-footer>
            </div>
        </div>
        <div id="newTaskModal" class="product-modal" ref="taskModal">
            <div class="pass-modal__content">
                <span class="close product-modal__close" id="closeTaskModal">x</span>
                <div class="modal-body product-modal__body">
                    <form action="#" @submit.prevent="addNewTask" autocomplete="off" id="addTaskForm">
                        <div class="form-group">
                            <label>Task name</label>
                            <input type="text" name="name" required v-model="name" class="form-control"
                                   id="addNewTaskName" placeholder="Task name">
                        </div>
                        <div class="form-group">
                            <label>Credential set</label>
                            <select class="form-control" required name="type" v-model="credentialId"
                                    id="addNewTaskCred">
                                <option v-for="value in credentialData" :value="value.id">
                                    {{ value.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <el-checkbox label="Notify support" name="type" v-model="check"></el-checkbox>
                        </div>
                        <div id="check-result" v-if="check">
                            <div class="form-group">
                                <label>Support message</label>
                                <textarea required class="form-control" v-model="supportMessage" rows="5" placeholder="Enter message"></textarea></div>
                            <div class="form-group">
                                <div class="d-flex justify-content-center w-100">
                                    <div class="d-flex justify-content-between w-25">
                                        <label class="pt-3">Region</label>
                                        <el-button type="success" icon="el-icon-plus" @click="addRegion"
                                                   circle></el-button>
                                    </div>
                                </div>
                                <div id="selectResult"
                                     class="d-flex flex-wrap justify-content-between align-items-baseline"
                                     v-for="(item, index) in selects">
                                    <div class="d-flex flex-wrap w-75" v-model="item.selected">
                                        <select class="form-control mt-3 mb-3 w-100" v-model="regions">
                                            <option v-for="value in regionData" :value="value.regionId">
                                                {{ value.name }}
                                            </option>
                                        </select>
                                    </div>

                                    <el-button @click="deleteRegion" icon="el-icon-close" circle></el-button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer product-modal__footer">
                            <button type="submit" class="btn btn-primary" id="submitTaskModal">Confirm</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import AppHeader from '@/components/AppHeader';
    import AppSidebar from '@/components/AppSidebar';
    import AppFooter from '@/components/AppFooter'

    export default {
        name: 'taskManagement',
        data() {
            return {
                tableTaskData: [],
                regionData: [],
                credentialData: [],
                check: false,
                selects: [],
                loading: true
            }
        },
        components: {
            AppHeader,
            AppSidebar,
            AppFooter
        },
        mounted() {
            this.loadTaskData();
        },
        methods: {
            loadTaskData() {
                this.$http.get('/tasks').then((response) => {
                    this.loading = false;
                    this.tableTaskData = response.data;
                    console.log(this.tableTaskData = response.data)
                }).catch((error) => {
                    console.log(error);
                });
                this.$http.get('/regions').then((response) => {
                    this.regionData = response.data;
                    console.log(this.regionData);
                }).catch((error) => {
                    console.log(error)
                });
                this.$http.get('/credentials').then((response) => {
                    this.credentialData = response.data;
                }).catch((error) => {
                    console.log(error);
                });
            },
            openTaskModal() {
                let modal = document.getElementById('newTaskModal');
                let close = document.getElementById('closeTaskModal');
                let submit = document.getElementById('submitTaskModal');
                document.querySelectorAll('#addNewTaskName, #addNewTaskCred, #addNewTaskCred').forEach(el => el.value = '');
                submit.disabled = false;
                this.check = false;
                modal.setAttribute("style", "opacity: 1; z-index:1032;");
                close.addEventListener('click', function () {
                    modal.setAttribute("style", "opacity: 0; z-index:-1;");
                });
                window.addEventListener('click', function (event) {
                    if (event.target == modal) {
                        modal.setAttribute("style", "opacity: 0; z-index:-1;");
                    }
                });
                let checkResult = document.getElementById('check-result');
                let checkbox = document.querySelector('input[type=checkbox]');
            },
            addRegion() {
                this.selects.push({
                    selected: ''
                });
            },
            deleteRegion(index) {
                this.selects.splice(index, 1);
            },
            addNewTask: function () {
                let checked = this.check;
                let newTask = {};
                if (checked != true) {
                    // console.log('success');
                    newTask['name'] = this.name,
                    newTask['type'] = 'programmaticUserCreation',
                    newTask['credentialId'] = this.credentialId
                } else {
                    // console.log('fail');
                    newTask['name'] = this.name,
                    newTask['type'] = 'programmaticUserCreation',
                    newTask['credentialId'] = this.credentialId,
                    newTask['supportMessage'] = this.supportMessage,
                    newTask['regions'] = this.regions
                }
                console.log(newTask);

                this.$http.put('/tasks', newTask).then((response) => {
                    submitAddUser.disabled = true;
                    this.$nextTick(() => {
                        this.$refs.taskModal.classList.add('modal__close');
                        this.$refs.taskModal.setAttribute("style", "opacity: 0; z-index:-1;");
                        this.loadTaskData();
                        this.$notify({
                            title: 'Success',
                            message: 'New task created!',
                            type: 'success'
                        });
                        this.loading = true;
                    });
                }).catch((error) => {
                    console.log(error)
                });
            },
            deleteTask(task) {
                let deleteTask = this.tableTaskData.find((item) => item.name === task);
                let taskId = deleteTask.id;
                this.$http.delete(`/tasks/${taskId}`).then((response) => {
                    this.$notify({
                        title: 'Success',
                        message: 'Task was deleted!',
                        type: 'success'
                    });
                    this.loadTaskData();
                }).catch((error) => {
                    console.log(error);
                });
                this.loading = true;
            }
        }
    }
</script>

<style scoped>
    .close-icon {
        width: 30px;
        height: 30px;
        background-image: url("../assets/images/close.png");
        background-repeat: no-repeat;
        background-size: contain;
        cursor: pointer;
        margin-top: 18px;
    }
</style>
