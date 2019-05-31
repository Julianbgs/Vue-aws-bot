<template lang="html">
    <div class="container-scroller">
        <app-header></app-header>
        <div class="container-fluid page-body-wrapper">
            <app-sidebar></app-sidebar>
            <div class="main-panel">
                <div class="content-wrapper">
                    <section class="dashboard">
                        <!--<div class="row">-->
                            <!--<div class="col-lg-12 grid-margin">-->
                                <!--<div class="card">-->
                                    <!--<div class="card-body">-->

                                    <!--</div>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                        <data-tables-server
                                :data="taskRunTable"
                                :total="total"
                                :filters="filters"
                                @query-change="reloadTaskRun"
                                :pagination-props="{ pageSizes: [20, 50, 100] }"
                                v-loading="loading">
                            <el-table-column
                                    prop="taskName"
                                    label="Task name"
                                    custom
                                    width="300"
                                    sortable="custom">
                            </el-table-column>
                            <el-table-column
                                    prop="startedAt"
                                    label="Started"
                                    width="300"
                                    sortable="custom">
                            </el-table-column>
                            <el-table-column
                                    prop="endedAt"
                                    label="Ended"
                                    width="300"
                                    sortable="custom">
                            </el-table-column>
                            <el-table-column
                                    prop="actions"
                                    label="Actions"                                   >
                                <template slot-scope="props">
                                    <!--<button class="btn btn-success ml-2 mr-2" @click="showEditUserModal(props.row.firstName)">-->
                                    <!--Edit-->
                                    <!--</button>-->
                                    <!--<button type='button' class='btn btn-danger ml-2 mr-2'>-->
                                    <!--Delete-->
                                    <!--</button>-->
                                    <!--<el-button type="primary" icon="el-icon-edit" circle></el-button>-->
                                    <el-button type="primary" icon="el-icon-download" circle @click="downloadFile(props.row.taskId)"></el-button>
                                </template>
                            </el-table-column>
                        </data-tables-server>
                    </section>
                </div>
                <app-footer></app-footer>
            </div>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import AppHeader from '@/components/AppHeader';
    import AppSidebar from '@/components/AppSidebar';
    import AppFooter from '@/components/AppFooter';

    export default {
        name: 'home',
        data() {
            return {
                taskRunTable:[],
                filters: [
                    {
                        value: '',
                        search_prop: 'name'
                    },
                    {
                        value: [],
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
            this.loadTaskRun();
        },
        methods: {
            loadTaskRun() {
                this.$http.get('/task-runs?limit=20&page=1&orderBy=startedAt&order=desc').then((response) => {
                    let dt = response.data.data;
                    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                    dt.forEach((item) => {
                        item.startedAt = new Date(item.startedAt).toLocaleDateString("en-US", options);
                        if ( item.endedAt !== 0 ) {
                            item.endedAt = new Date(item.endedAt).toLocaleDateString("en-US", options);
                        }
                    });
                    this.taskRunTable = dt;
                    // console.log(this.taskRunTable);
                    this.loading = false;
                }).catch((error) => {
                    console.log(error);
                })
            },
            reloadTaskRun(queryInfo) {
                let refreshQuery = '';
                refreshQuery = refreshQuery + `limit=${queryInfo.pageSize}&page=${queryInfo.page}`;
                if (queryInfo.sort.prop !== null && typeof queryInfo.sort.prop !== 'undefined'){
                    refreshQuery = refreshQuery + `&sortBy=${queryInfo.sort.prop}&order=${queryInfo.sort.order === 'ascending' ? 'asc' : 'desc'}`;
                    // console.log(refreshQuery)
                }
                this.$http.get(`/task-runs?${refreshQuery}`).then((response) => {
                    let dt = response.data.data;
                    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                    dt.forEach((item) => {
                        item.startedAt = new Date(item.startedAt).toLocaleDateString("en-US", options);
                        // console.log(item.endedAt);
                        if ( item.endedAt !== 0 ) {
                            item.endedAt = new Date(item.endedAt).toLocaleDateString("en-US", options);
                        }
                    });
                    this.taskRunTable = dt;
                    this.total = dt.length;
                    this.loading = false;
                }).catch((error) => {
                    console.log(error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('apiKey');
                    localStorage.removeItem('role');
                    this.$router.push({ path: '/login' });
                });
                this.loading = true;
            },
            downloadFile: function (data) {
                let taskRun = this.taskRunTable.find((item) => item.taskId === data);
                let taskRunId = taskRun.id;
                this.$http.get(`/task-runs/${taskRunId}?isCSV=true`, {responseType: 'arraybuffer'})
                    .then(function (response) {
                        let headers = response.headers;
                        let blob = new Blob([response.data],{type:headers['content-type']});
                        let link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = taskRun.taskName + '.csv';
                        link.click();
                    }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }
</script>
