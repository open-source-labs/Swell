import { useState, useEffect } from 'react';
import { Form } from 'react-router-dom';

interface Props {
  newRequestBody: {
    bodyContent: string;
    [key: string]: any;
  }
  newRequestBodySet: (arg0: { bodyContent: string;[key: string]: any }) => void;
}

interface WWWField {
  id: string;
  active: boolean;
  key: string;
  value: string;
}

export default function WWWForm({ newRequestBody, newRequestBodySet }: Props) {
  const [wwwFields, setWwwFields] = useState<WWWField[]>([]);
  const [rawString, setRawString] = useState('');

  useEffect(() => {
    const matches = newRequestBody.bodyContent.match(
      /(([^(&|\n)]+=[^(&|\n)]+)&?)+/g
    );
    if (matches) {
      newRequestBodySet({
        ...newRequestBody,
        bodyContent: matches.join(''),
      });
    } else {
      newRequestBodySet({
        ...newRequestBody,
        bodyContent: '',
      });
    }
    addFieldIfNeeded();
  }, []);

  useEffect(() => {
    if (newRequestBody.bodyContent !== rawString) {
      checkOldBody();
    }
    const wwwFieldsDeepCopy = createWWWClone();
    if (
      wwwFieldsDeepCopy.length === 0 ||
      wwwFieldsDeepCopy[wwwFieldsDeepCopy.length - 1]?.key !== ''
    ) {
      addWwwField();
    }
  }, [newRequestBody.bodyContent]);

  function createWWWClone(): WWWField[] {
    return JSON.parse(JSON.stringify(wwwFields));
  }

  function checkOldBody() {
    if (!newRequestBody.bodyContent.includes('&')) {
      const key = newRequestBody.bodyContent.split('=')[0];
      const value = newRequestBody.bodyContent.split('=')[1];
      setWwwFields([
        {
          id: `id${wwwFields.length}`,
          active: true,
          key,
          value,
        },
      ]);
      setRawString(newRequestBody.bodyContent);
      addFieldIfNeeded();
    } else {
      const fields = newRequestBody.bodyContent
        .split('&')
        .map((field) => {
          const key = field.split('=')[0];
          const value = field.split('=')[1];
          return {
            id: `id${wwwFields.length}`,
            active: true,
            key,
            value,
          };
        })
        .filter((field) => field.key !== '' || field.value !== '');
      setWwwFields(fields);
      setRawString(newRequestBody.bodyContent);
    }
  }

  function addWwwField() {
    const wwwFieldsDeepCopy = createWWWClone();
    wwwFieldsDeepCopy.push({
      id: `id${wwwFields.length}`,
      active: false,
      key: '',
      value: '',
    });
    setWwwFields(wwwFieldsDeepCopy);
  }

  function updateWwwField(
    id: string,
    field: 'key' | 'value',
    value: string
  ) {
    const wwwFieldsDeepCopy = createWWWClone();
    let indexToBeUpdated: number = -1;
    for (let i = 0; i < wwwFieldsDeepCopy.length; i++) {
      if (wwwFieldsDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }
    const target = wwwFieldsDeepCopy[indexToBeUpdated];
    target[field] = value;
    if (field === 'key' || field === 'value') {
      target.active = true;
      addWwwField();
    }
    setWwwFields(wwwFieldsDeepCopy);
  }

  function addFieldIfNeeded() {
    if (isWwwFieldsEmpty()) {
      const wwwFieldsDeepCopy = createWWWClone();
      wwwFieldsDeepCopy.push({
        id: `id${wwwFields.length}`,
        active: false,
        key: '',
        value: '',
      });
      setWwwFields(wwwFieldsDeepCopy);
    }
  }

  function isWwwFieldsEmpty() {
    if (wwwFields.length === 0) {
      return true;
    }
    return (
      wwwFields
        .map((wwwField) => (wwwField.key === '' && wwwField.value === '' ? 1 : 0))
        .reduce((acc, cur) => (acc === 0 ? cur : acc)) === 0
    );
  }
}
