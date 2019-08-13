import React from 'react';

const ResponseBatchLogDisplay = ({ content }) => {
  // const { events, headers } = response;
  const displayContents = [];

  
    for(let i =0; i < content.batchCount; i++){
      displayContents.push(
          `${content.batchlogCounter} TimeSent:${content.timeSent}TimeRecieved:${content.timeRecieved}`, <br/>
      );
      i++
      // console.log(content.batchlogCounter)
    }
  

  return <div className="tab_content-response">{displayContents}</div>;
}

export default ResponseBatchLogDisplay;
