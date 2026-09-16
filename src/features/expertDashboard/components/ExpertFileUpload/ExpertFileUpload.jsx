import React, { useId, useRef, useState } from 'react';
import AdminIcon from '../../../adminDashboard/components/AdminIcon/AdminIcon';
import { useExpertI18n } from '../../i18n/ExpertI18nContext';

export default function ExpertFileUpload({ label, value, onChange, multiple = false, error = '' }) {
  const { t } = useExpertI18n();
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const files = value ? (Array.isArray(value) ? value : [value]) : [];

  const selectFiles = (fileList) => {
    const selected = Array.from(fileList || []);
    if (!selected.length) return;
    onChange(multiple ? selected : selected[0]);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    selectFiles(event.dataTransfer.files);
  };

  const clear = () => {
    onChange(multiple ? [] : null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`expert-upload-field${error ? ' is-error' : ''}`}>
      <label className="expert-field-label" htmlFor={inputId}>{label}</label>
      <div
        className={`expert-upload${dragActive ? ' is-dragging' : ''}${files.length ? ' has-file' : ''}`}
        onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }}
        onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
        onDragLeave={(event) => { event.preventDefault(); setDragActive(false); }}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple={multiple}
          onChange={(event) => selectFiles(event.target.files)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
        />
        {!files.length ? (
          <div className="expert-upload__empty">
            <span><AdminIcon name="paperclip" size={22} /></span>
            <div><b>{t('upload.drop')} <button type="button" onClick={() => inputRef.current?.click()}>{t('upload.browse')}</button></b><small id={`${inputId}-hint`}>{t('upload.localOnly')}</small></div>
          </div>
        ) : (
          <div className="expert-upload__selected">
            <span><AdminIcon name="check" size={19} /></span>
            <div>
              {files.map((file) => <b key={`${file.name}-${file.lastModified}`}>{file.name}</b>)}
              <small id={`${inputId}-hint`}>{t('upload.localOnly')}</small>
            </div>
            <div className="expert-upload__actions">
              <button type="button" onClick={() => inputRef.current?.click()}>{t('upload.replace')}</button>
              <button type="button" onClick={clear}>{t('upload.remove')}</button>
            </div>
          </div>
        )}
      </div>
      {error && <small className="expert-field-error" id={`${inputId}-error`}>{error}</small>}
    </div>
  );
}
