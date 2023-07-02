import connectionController from './reqResController';
const trpcController = {
  sendRequest: async function (reqRes) {
    connectionController.openReqRes(reqRes.id);
  },
};

export default trpcController;
