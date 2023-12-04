import React, { Component } from 'react';
import { connect } from 'react-redux';
import './AdminManagement.scss';
import AdminModalAddNewUser from './AdminModal/AdminModalAddNewUser';
import * as actions from '../../../store/actions/index';
import toast from 'react-hot-toast';
import * as services from '../../../services/index';
import { options } from '../../../utils';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button } from 'reactstrap';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { MdPersonAddAlt1 } from 'react-icons/md';
class AdminManagement extends Component {
     constructor(props) {
          super(props);
          this.state = {
               isOpenModal: false,
               arrAdminsPending: [],
               username: '',
               phone: '',
               password: '',
               selectedPendingAdmin: '',
               isEdit: true
          };
     }

     async componentDidMount() {
          let res = await this.props.getAllUserPending();
     }
     componentDidUpdate(prevProps, prevState, snapshot) {
          if (prevProps.arrAdminsPending !== this.props.arrAdminsPending) {
               this.setState({
                    arrAdminsPending: this.props.arrAdminsPending,
               });
          }
     }
     // Handle on change input
     handleOnchangeInput = (event, id) => {
          let copyState = this.state;
          copyState[id] = event.target.value;
          this.setState({
               ...copyState,
          });
     };
     // Close modal
     isCloseModal = () => {
          this.setState({
               isOpenModal: false,
          });
     };
     // Delete admin pending
     handleDeleteUserPending = async () => {
          let { selectedPendingAdmin} = this.state;
          let id = selectedPendingAdmin[0].id;
          console.log("check id : ", id)
          if (id) {
               let res = await services.deleteUserPending(id);
               console.log(res);
               if (res && res.errorCode === 0) {
                    toast.success(res.message);
                    await this.props.getAllUserPending();
               } else {
                    toast.error(res.message);
               }
          }
     };
     // open modal edit admin pending
     openModalEditUserPending = (user) => {
          this.props.fetchDataEditPendingAdmin(user);
          this.props.isEditAdminPending();
          this.setState({
               isOpenModal: true,
               isEditUser: true,
          });
     };
     // Edit user pennding 
     handleEditUserPending = () => {
          let {selectedPendingAdmin} = this.state;
          this.setState({
               username: selectedPendingAdmin[0].username,
               phone: selectedPendingAdmin[0].phone,
               password: selectedPendingAdmin[0].password,
               isEdit: !this.state.isEdit
          })
     }
     handleCreatePotentialAdmin = async () => {
          let data = {
               username: this.state.username,
               password: this.state.password,
               phone: this.state.phone,
          };
          console.log('check data: ', data);
          let res = await services.handleCreateNewPotentialAdmin(data);
          console.log('check res: ', res);
          if (res && res.errorCode === 0) {
               this.setState({
                    username: '',
                    phone: '',
                    password: '',
               });
               toast.success(res.msg);
               this.props.getAllUserPending();
          }
     };
     render() {
          let { arrAdminsPending, rows, isEdit } = this.state;
          return (
               <>
                    <div className="admin-container my-3">
                         <div className="title-admin text-center my-4">
                              <span>Create Account</span>
                         </div>

                         <div className="admin-content container">
                              <div className="container">
                                   <div className="row">
                                        <div className="col-6 form-group">
                                             <label>fullname</label>
                                             <input
                                                  className="form-control"
                                                  onChange={(event) => this.handleOnchangeInput(event, 'fullname')}
                                                  value={this.state.fullname}
                                             ></input>
                                        </div>
                                        <div className="col-6 form-group">
                                             <label>username</label>
                                             <input
                                                  className="form-control"
                                                  onChange={(event) => this.handleOnchangeInput(event, 'username')}
                                                  value={this.state.username}
                                             ></input>
                                        </div>
                                        <div className="col-6 form-group">
                                             <label>Phone</label>
                                             <input
                                                  className="form-control"
                                                  onChange={(event) => this.handleOnchangeInput(event, 'phone')}
                                                  value={this.state.phone}
                                             ></input>
                                        </div>
                                        <div className="col-6 form-group">
                                             <label>password</label>
                                             <input
                                                  className="form-control"
                                                  onChange={(event) => this.handleOnchangeInput(event, 'password')}
                                                  value={this.state.password}
                                             ></input>
                                        </div>
                                   </div>
                              </div>
                              <div className="btn-director-add-new-user-container">
                                   <div className="btn-create-new-user-container button">
                                        <Button
                                             // className="btn-create-new-user"
                                             className="btn btn-primary button"
                                             onClick={() => this.handleCreatePotentialAdmin()}
                                        >
                                             <MdPersonAddAlt1 className="button" />
                                             <span>Create</span>
                                        </Button>
                                   </div>
                                   <div className="btn-option-container ">
                                        <Button
                                             className="btn btn-warning px-4 button "
                                             onClick={() => this.handleEditUserPending()}
                                        >
                                             <EditTwoToneIcon className="button"
                                            
                                              />
                                             <span>{isEdit ? "Edit" : "Save" }</span>
                                        </Button>
                                        <Button
                                             className="btn btn-danger button"
                                             onClick={() => this.handleDeleteUserPending()}
                                        >
                                             <DeleteForeverTwoToneIcon className="button" />
                                             <span>Delete</span>
                                        </Button>
                                   </div>
                              </div>
                              <div className="table-user-content mt-2 mb-3 ">
                                   <div style={{ height: 400, width: '100%' }}>
                                        <DataGrid
                                             sx={{
                                                  border: 1,
                                                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                                                  fontSize: 16,
                                             }}
                                             slots={{ toolbar: GridToolbar }}
                                             slotProps={{
                                                  toolbar: {
                                                       showQuickFilter: true,
                                                  },
                                             }}
                                             rows={arrAdminsPending}
                                             columns={options.columnsPotentialCandidate}
                                             pageSizeOptions={[5, 7]}
                                             autoHeight={true}
                                             checkboxSelection={true}
                                             onRowSelectionModelChange={(ids) => {
                                                  const selectedIDs = new Set(ids);

                                                  let selectedRowData = [];
                                                  arrAdminsPending.map((row) => {
                                                       selectedIDs.has(row.id);
                                                       if (selectedIDs.has(row.id)) {
                                                            selectedRowData.push(row);
                                                       }
                                                  });
                                                  this.setState({
                                                       selectedPendingAdmin: selectedRowData,
                                                  });
                                             }}
                                             initialState={{
                                                  pagination: {
                                                       paginationModel: { page: 0, pageSize: 5 },
                                                  },
                                             }}
                                        />
                                   </div>
                              </div>
                         </div>
                    </div>
               </>
          );
     }
}

const mapStateToProps = (state) => {
     return {
          arrAdminsPending: state.admin.arrAdminsPending,
     };
};

const mapDispatchToProps = (dispatch) => {
     return {
          getAllUserPending: () => dispatch(actions.getAllUserPendingAction()),
          fetchDataEditPendingAdmin: (user) => dispatch(actions.fetchDataEditPendingAdminAction(user)),
          isEditAdminPending: () => dispatch(actions.isEditAdminPendingAction()),
          isNotEditAdminPending: () => dispatch(actions.isNotEditAdminPendingAction()),
     };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminManagement);
