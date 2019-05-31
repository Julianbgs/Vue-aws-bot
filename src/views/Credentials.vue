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
                                                    <el-button icon="el-icon-plus" type="primary" @click="openModal">
                                                        Add Credential Set
                                                    </el-button>
                                                </div>
                                            </div>
                                        </div>
                                        <data-tables
                                                :data="tableData"
                                                v-loading="loading"
                                                :pagination-props="{ pageSizes: [5, 10, 15] }"
                                                :total="total"
                                                :filters="filters"
                                                width="100%">
                                            <el-table-column
                                                    prop="name"
                                                    label="Name"
                                                    custom
                                                    sortable
                                                    width="auto">
                                            </el-table-column>
                                            <el-table-column
                                                    prop="actions"
                                                    label="Actions"
                                                    width="320">
                                                <template slot-scope="props">
                                                <el-tooltip class="item" effect="dark" content="Delete current credentials"
                                                                placement="top-start">
                                                    <el-button type="danger" icon="el-icon-delete"  circle></el-button>
                                                 </el-tooltip>
                                                 <el-tooltip class="item" effect="dark" content="Download current csv"
                                                                placement="top-start">
                                                    <el-button type="primary" icon="el-icon-download" circle @click="downloadFile(props.row.name)"></el-button>
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
        <div id="newCredentialsModal" class="product-modal" ref="addModal">
            <div class="pass-modal__content">
                <span class="close product-modal__close" id="closeCredentialsModal">x</span>
                <div class="modal-body product-modal__body">
                    <form method="post">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" id="file-name" name="name" placeholder="Name" v-model="name">
                        </div>
                        <div class="form-group">
                            <input type="file" name="credentialsFile" multiple accept="text/csv" class="inputfile"
                                   id="file-upload" ref="file" v-on:change="handleFileUpload()">
                            <label for="file-upload" class="btn btn-primary">Choose a file</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer product-modal__footer">
                    <button type="button" class="btn btn-primary" id="upload-submit" @click="submitEvent">Confirm
                    </button>
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
        name: 'credentials',
        data() {
            return {
                tableData: [],
                filters: [
                    {
                        value: '',
                        search_prop: 'name'
                    }
                ],
                total: 0,
                loading: true,
                file: ''
            }
        },
        components: {
            AppHeader,
            AppSidebar,
            AppFooter
        },
        mounted() {
            this.loadData();
        },
        methods: {
            loadData() {
                this.$http.get('/credentials').then((response) => {
                    this.loading = false;
                    this.tableData = response.data;
                    console.log(this.tableData);
                }).catch((error) => {
                    console.log(error);
                });
            },
            openModal() {
                let modal = document.getElementById('newCredentialsModal');
                let close = document.getElementById('closeCredentialsModal');
                let submit = document.getElementById('upload-submit');

                submit.disabled = false;
                modal.classList.remove('modal__close');
                modal.setAttribute("style", "opacity: 1; z-index:1032;");
                close.addEventListener('click', function () {
                    modal.setAttribute("style", "opacity: 0; z-index:-1;");
                });
                window.addEventListener('click', function (event) {
                    if (event.target == modal) {
                        modal.setAttribute("style", "opacity: 0; z-index:-1;");
                    }
                });
            },
            handleFileUpload() {
                this.file = this.$refs.file.files[0];
            },
            submitEvent() {
                let upload = document.getElementById('file-upload');
                let value = upload.value;
                let splitValue = value.split('.');
                if (splitValue[splitValue.length - 1] === 'csv') {
                    let formData = new FormData();
                    formData.append('credentialsFile', this.file);
                    formData.append('name', this.name);

                    this.$http.put('/credentials',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then((response) => {
                        this.$nextTick(() => {
                            this.$refs.addModal.classList.add('modal__close');
                            this.$refs.addModal.setAttribute("style", "opacity: 0; z-index:-1;");
                            this.loadData();
                            this.$notify({
                                title: 'Success',
                                message: 'New credential created!',
                                type: 'success'
                            });
                            this.loading = true;
                        });
                    }).catch((error) => {
                        console.log(error);
                    });

                } else {
                    event.preventDefault();
                    this.$notify({
                        title: 'Warning',
                        message: 'File is not uploaded!',
                        type: 'error'
                    });
                }
            },
            downloadFile: function (data) {
                let dataId = this.tableData.find((item) => item.name === data);
                this.$http.get(`/credentials/${dataId.id}`, {responseType: 'arraybuffer'})
                    .then(function (response) {
                        let headers = response.headers;
                        let blob = new Blob([response.data],{type:headers['content-type']});
                        let link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = dataId.name + '.csv';
                        link.click();
                    }).catch((error) => {
                        console.log(error);
                });
            }
        }
    }
</script>

<style scoped>
    .inputfile {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    /*.inputfile + label {*/
    /*font-size: 1em;*/
    /*font-weight: 300;*/
    /*color: white;*/
    /*background-color: #1da1f2;*/
    /*border-radius: 5px;*/
    /*display: inline-block;*/
    /*padding: 3px 4px;*/
    /*box-sizing: border-box;*/
    /*}*/

</style>