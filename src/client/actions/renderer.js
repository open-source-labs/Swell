const { ipcRenderer } = require('electron');

const ReqResCtrl = require('./src/client/controllers/connectionController')

ipcRenderer.on('openAllSelected', () => {
  console.log('here')
  ReqResCtrl.openAllSelectedReqRes()
})