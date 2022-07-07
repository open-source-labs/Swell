import React from 'react';
import { connect } from 'react-redux';
import { Box } from '@mui/material';
import WorkspaceSelect from './WorkspaceSelect';
import DeleteWorkspaceButton from './buttons/DeleteWorkspaceButton';
import ImportExportWorkspaceButton from './buttons/ImportExportWorkspaceButton';
import InviteToWorkspaceButton from './buttons/InviteToWorkspaceButton';
import { RootState } from '../../toolkit-refactor/store';

const mapStateToProps = (store: RootState) => {
  return {
    workspaces: store.collections,
  };
};

function CurrentWorkspaceDisplay(props) {
  return (
    <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', pb: 1 }}>
      {/* The below select menu should contain all saved workspaces in the Swell app. */}
      <WorkspaceSelect {...props} />
      {/* <SaveWorkspaceButton /> */}
      <DeleteWorkspaceButton
        id={props.currentWorkspaceId}
        currentWorkspace={props.currentWorkspace}
      />
      <ImportExportWorkspaceButton />
      <InviteToWorkspaceButton />
    </Box>
  );
}

export default connect(mapStateToProps)(CurrentWorkspaceDisplay);
