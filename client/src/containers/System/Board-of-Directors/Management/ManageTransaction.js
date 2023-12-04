import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../AdminManagement.scss';
import ModalManageTransaction from '../AdminModal/ModalManageTransaction';
import { deleteTransactionById } from '../../../../services/adminService';
import toast from 'react-hot-toast';
import * as actions from '../../../../store/actions/index';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button } from 'reactstrap';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { options } from '../../../../utils';
class ManageTransaction extends Component {
     constructor(props) {
          super(props);
          this.state = {
               isOpenModal: false,
               arrTransactions: [],
          };
     }
     async componentDidMount() {
          await this.props.getAllTransactions();
     }
     componentDidUpdate(prevProps, prevState, snapshot) {
          if (prevProps.arrTransactions !== this.props.arrTransactions) {
               this.setState({
                    arrTransactions: this.props.arrTransactions,
               });
          }
          if (prevProps.arrAdminsPending !== this.props.arrAdminsPending) {
               this.setState({
                    arrAdminsPending: this.props.arrAdminsPending,
               });
          }
     }
     isOpenModalCreateTransaction = () => {
          this.props.isNotTransaction();
          this.props.clearDataEditTransaction();
          this.setState({
               isOpenModal: true,
          });
     };
     isCloseModal = () => {
          this.setState({
               isOpenModal: false,
          });
     };

     handleDeleteTransaction = async (id) => {
          let res = await deleteTransactionById(id);
          if (res && res.errorCode === 0) {
               await this.props.getAllTransactions();
               toast.success('Delete Transaction success');
          } else {
               toast.success('Delete Transaction failed');
          }
     };
     isOpenModalEditTransaction = (transaction) => {
          this.props.isEditTransaction();
          this.props.fetchDataEditTransaction(transaction);
          this.setState({
               isOpenModal: true,
          });
     };
     render() {
          let { arrTransactions } = this.state;

          // console.log('check transaction : ', arrTransactions);
          return (
               <>
                    <div className="admin-container my-3">
                         <ModalManageTransaction isOpen={this.state.isOpenModal} isCloseModal={this.isCloseModal} />

                         <div className="title-admin text-center my-4">Manage Transaction</div>
                         <div className="admin-content container">
                              <div className="btn-director-add-new-user-container">
                                   <div className="btn-create-new-user-container">
                                        <button
                                             // className="btn-create-new-user"
                                             className="btn btn-primary"
                                             onClick={() => this.isOpenModalCreateTransaction()}
                                        >
                                             <i className="fas fa-plus"></i>
                                             <span>Add New User</span>
                                        </button>
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
                                             rows={arrTransactions}
                                             columns={options.columnsTransaction}
                                             pageSizeOptions={[5, 7]}
                                             autoHeight={true}
                                             checkboxSelection={true}
                                             onRowSelectionModelChange={(ids) => {
                                                  const selectedIDs = new Set(ids);

                                                  let selectedRowData = [];
                                                  arrTransactions.map((row) => {
                                                       selectedIDs.has(row.id);
                                                       if (selectedIDs.has(row.id)) {
                                                            selectedRowData.push(row);
                                                       }
                                                  });
                                                  this.setState({
                                                       selectedTransaction: selectedRowData,
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
          arrTransactions: state.admin.arrTransactions,
     };
};

const mapDispatchToProps = (dispatch) => {
     return {
          getAllTransactions: () => dispatch(actions.getAllTransactionsAction()),
          isEditTransaction: () => dispatch(actions.isEditTransactionAction()),
          fetchDataEditTransaction: (data) => dispatch(actions.fetchDataEditTransactionAction(data)),
          clearDataEditTransaction: () => dispatch(actions.clearDataEditTransactionAction()),
          isNotTransaction: () => dispatch(actions.isNotTransactionAction()),
     };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTransaction);
