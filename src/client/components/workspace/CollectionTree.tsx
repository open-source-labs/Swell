import React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';

/**@todo delete when slice conversion complete */
import * as actions from '../../features/business/businessSlice';

import {
  reqResUpdated,
  reqResItemDeleted,
} from '../../toolkit-refactor/reqRes/reqResSlice';

// import RequestCard from "./RequestCard";
import ReqResContainer from '../legacy-components/ReqResContainer';

import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography } from '@mui/material';

/**@todo switch to use hooks? */
const mapStateToProps = (store) => ({
  reqResArray: store.business.reqResArray,
  currentTab: store.business.currentTab,
});

/**@switch to use hooks? */
const mapDispatchToProps = (dispatch) => ({
  reqResItemDeleted: (reqRes) => {
    dispatch(reqResItemDeleted(reqRes));
  },
  reqResUpdated: (reqRes) => {
    dispatch(reqResUpdated(reqRes));
  },
});

function CollectionTree({ currentWorkspace, itemDeleted, updated }) {
  const { reqResArray } = currentWorkspace;
  const requestTreeItems = [];
  for (let i = 0; i < reqResArray.length; i += 1) {
    requestTreeItems.push(
      <TreeItem
        key={reqResArray[i].id}
        nodeId={reqResArray[i].id}
        label={
          /**@todo maybe access functions (last two) directly from container instead of passing through props? */
          <SingleReqResContainer
            className="reqResChild"
            content={reqResArray[i]}
            key={reqResArray[i].id}
            index={i}
            itemDeleted={itemDeleted}
            updated={updated}
          />
        }
      />
    );
  }
  // key={request.id} request={request}

  // <RequestCard
  //   key={reqResArray[i].id}
  //   content={reqResArray[i]}
  //   index={i}
  //   itemDeleted={itemDeleted}
  //   updated={updated}
  // />

  return (
    <Box
      className="collection-tree"
      sx={{
        pt: 1,
      }}
    >
      {
        reqResArray.length === 0 ? (
          // If there are no requests in the current workspace, render this text.
          <Typography variant="caption">
            Start this Workspace by adding a request from the composer.
          </Typography>
        ) : (
          // If there are requests in the current workspace, render the collection tree.
          <ReqResContainer displaySchedule />
        )
        // : <TreeView
        //     aria-label="collection navigator"
        //     defaultCollapseIcon={<ExpandMoreIcon />}
        //     defaultExpandIcon={<ChevronRightIcon />}
        //     sx={{ flexGrow: 1, overflowY: 'auto' }}
        //   >
        //     <TreeItem nodeId={currentWorkspace.id} label={currentWorkspace.name}>
        //       {requestTreeItems}
        //     </TreeItem>
        //   </TreeView>
      }
    </Box>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionTree);
