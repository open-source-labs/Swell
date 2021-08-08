

PEER CLASS
* `webrtcPeerController.js` (src/client/controllers/webrtcPeerController.js)
  * built **`Peer`** class as default export.
  * NOTE: The `src/client/controllers/webrtcPeerController.js` filename is leftover from earlier experimentation (prior to making a class).  It may be worth changing the name to just `webrtcPeer` or even just `Peer.js` in order to better represent what it contains.

BUTTON CLICK >>> LOCAL SDP 
* `WebRTCRequestContent.jsx` (src/client/components/display/WebRTCRequestContent.jsx)
  * `Peer` is imported at the top of this component file.
  * `iceConfiguration` is still declared in the upper most scope of this file. This contains the server details.
  * Within the default export `WebRTCRequestContent()` is a nested function **`createLocalSDP()`** (line 45). This function will be invoked on the click event of the "Create Local SDP" button.
  * when `createLocalSDP()` is invoked 
    * the constant **`pcInitiator`** is added to the `globalThis` global object and assigned to be a new instance of class `Peer`.
    * pcInitiator role is set to INITIATOR
    * Peer method `initDataChannelAndEvents()` is invoked on `pcInitiator` 
      * data channel event handlers are set and a new data channel is created
    * Peer method **`createLocalSdp()`** is invoked on `pcInitiator`
      * creates the Offer
      * ICE candidates are gathered
      * Final Offer passed into LocalDescription
    

    






