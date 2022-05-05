import { v4 as uuid } from 'uuid';
import db from '../db';
import * as store from '../store';
import * as actions from '../actions/actions';
import { Workspace, WindowAPIObject, WindowExt } from '../../types';

const { api }: { api: WindowAPIObject } = window as unknown as WindowExt;

const githubController = { 
  // on login we need to go through a users
}

export default githubController;