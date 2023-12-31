import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import adminReducer from './adminReducer';
import appReducer from './appReducer';
import userReducer from './userReducer';
import transactionAdminReducer from './transactionAdminReducer';
import collectionAdminReducer from './collectionAdminReducer';
import transactionStaffReducer from './transactionStaffReducer';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistCommonConfig = {
     storage: storage,
     stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
     ...persistCommonConfig,
     key: 'user',
     whitelist: ['userInfo', 'isLoggedIn'],
};

const appPersistConfig = {
     ...persistCommonConfig,
     key: 'app',
     whitelist: ['language'],
};
export default (history) =>
     combineReducers({
          router: connectRouter(history),
          user: persistReducer(userPersistConfig, userReducer),
          app: persistReducer(appPersistConfig, appReducer),
          admin: adminReducer,
          adminTransaction: transactionAdminReducer,
          adminCollection: collectionAdminReducer,
          staffTransaction: transactionStaffReducer,
     });
