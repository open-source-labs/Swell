import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../toolkit-refactor/store';
import openApiController from '../../../controllers/openApiController';

const OpenAPIDocumentEntryForm: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.ui.isDark);

  return (
    <div className="mt-3">
      <div className="is-flex is-justify-content-flex-end is-align-content-center">
        <button
          className={`${
            isDark ? 'is-dark-300' : ''
          } button is-small add-header-or-cookie-button mr-1`}
          onClick={() => openApiController.importDocument()}
        >
          Load Document
        </button>
      </div>
    </div>
  );
};

export default OpenAPIDocumentEntryForm;

// import React from 'react';
// import { useSelector } from 'react-redux';

// import openApiController from '../../../controllers/openApiController'
// const OpenAPIDocumentEntryForm = (props) => {

//   const isDark = useSelector((state) => state.ui.isDark);

//   return (
//     <div className="mt-3">
//       <div className="is-flex is-justify-content-flex-end is-align-content-center">
//         <button
//           className={`${
//             isDark ? 'is-dark-300' : ''
//           } button is-small add-header-or-cookie-button mr-1`}
//           onClick={() => openApiController.importDocument()}
//         >
//           Load Document
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OpenAPIDocumentEntryForm;
