import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';
import transform from 'lodash/transform';
import uniq from 'lodash/uniq';
import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { isAdminSelector } from 'state/selectors/authSelectors';
import { purposesSelector, resourcesSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const dateSelector = state => state.ui.pages.adminResources.date || moment().format('YYYY-MM-DD');
const resourceIdsSelector = state => state.ui.pages.adminResources.resourceIds;
const filteredResourceTypesSelector = state => state.ui.pages.adminResources.filteredResourceTypes;

const adminResourcesSelector = createSelector(
  resourceIdsSelector,
  resourcesSelector,
  (resourceIds, resources) => resourceIds.map(id => resources[id])
);

const adminResourceTypesSelector = createSelector(
  adminResourcesSelector,
  resources => uniq(resources.map(resource => resource.type.name))
);

const filteredAdminResourceSelector = createSelector(
  adminResourcesSelector,
  filteredResourceTypesSelector,
  (resources, filteredResourceTypes) => sortBy(
    resources.filter(
      resource => !includes(filteredResourceTypes, resource.type.name)
    ), 'name')
);

const resourcesByPurposeSelector = createSelector(
  purposesSelector,
  filteredAdminResourceSelector,
  (purposes, resources) => {
    const resourceIdsByPurpose = {};
    resources.forEach(resource =>
      resource.purposes.forEach((purpose) => {
        const resourcesIds = resourceIdsByPurpose[purpose.parent || purpose.id];
        if (resourcesIds) {
          resourcesIds.push(resource.id);
        } else {
          resourceIdsByPurpose[purpose.parent || purpose.id] = [resource.id];
        }
      })
    );

    const rv = transform(
      resourceIdsByPurpose,
      (memo, resourceIds, purposeId) =>
        memo.push({ name: purposes[purposeId].name, resources: uniq(resourceIds) }),
      []
    );
    return rv;
  }
);

const adminResourcesPageSelector = createStructuredSelector({
  date: dateSelector,
  filteredResourceTypes: filteredResourceTypesSelector,
  isAdmin: isAdminSelector,
  isFetchingResources: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  resourcesByPurpose: resourcesByPurposeSelector,
  resourceTypes: adminResourceTypesSelector,
});

export default adminResourcesPageSelector;
