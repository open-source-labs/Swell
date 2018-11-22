const { ipcRenderer } = require('electron');

const ReqResCtrl = require('../controllers/connectionController')

ipcRenderer.on('openAllSelected', () => {
  console.log('here')
  ReqResCtrl.openAllSelectedReqRes()
})