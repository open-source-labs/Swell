import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import openApiController from '../../../controllers/openApiController';

// this component is working as intended

const OpenAPIDocumentEntryForm: React.FC = () => {
  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

  const importDoc = (): void => {
    openApiController.sendDocument();
    openApiController.importDocument();
  }

  return (
    <div className="mt-3">
      <div className="is-flex is-justify-content-flex-end is-align-content-center">
        <button
          className={`button is-small ${isDark ? 'is-dark-300' : 'is-outlined'} is-primary button-padding-verticals button-hover-color mr-1`}
          onClick={() => importDoc()}
        >
          Load Document
        </button>
      </div>
    </div>
  );
};

export default OpenAPIDocumentEntryForm;
