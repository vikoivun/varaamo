import React, { PropTypes } from 'react';

import ResourceInfoContainer from './ResourceInfo';

GroupInfo.propTypes = {
  date: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedResourceId: PropTypes.string,
};
export default function GroupInfo({ date, name, resources, selectedResourceId }) {
  return (
    <div className="group-info" title={name}>
      <div className="group-name"><div className="name">{name}</div></div>
      {resources.map(resource =>
        <ResourceInfoContainer
          date={date}
          id={resource}
          isSelected={resource === selectedResourceId}
          key={`${name}-${resource}`}
        />
      )}
    </div>
  );
}
