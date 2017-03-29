import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchFavoritedResources } from 'actions/resourceActions';
import { fetchPurposes } from 'actions/purposeActions';
import {
  changeAdminResourcesPageDate,
  filterAdminResourceType,
  openConfirmReservationModal,
  unfilterAdminResourceType,
} from 'actions/uiActions';
import PageWrapper from 'pages/PageWrapper';
import AvailabilityView from 'shared/availability-view';
import ResourceTypeFilter from 'shared/resource-type-filter';
import ReservationSuccessModal from 'shared/modals/reservation-success';
import ReservationConfirmationContainer from 'shared/reservation-confirmation';
import { injectT } from 'i18n';
import adminResourcesPageSelector from './adminResourcesPageSelector';

class UnconnectedAdminResourcesPage extends Component {
  constructor(props) {
    super(props);
    this.state = { selection: null };
    this.fetchResources = this.fetchResources.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const interval = 10 * 60 * 1000;
    this.props.actions.fetchPurposes();
    this.fetchResources();
    this.updateResourcesTimer = window.setInterval(this.fetchResources, interval);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.props.date) {
      this.fetchResources(nextProps.date);
    }
  }

  componentWillUnmount() {
    this.props.actions.changeAdminResourcesPageDate(null);
    window.clearInterval(this.updateResourcesTimer);
  }

  fetchResources(date = this.props.date) {
    this.props.actions.fetchFavoritedResources(moment(date), 'adminResourcesPage');
  }

  handleSelect(selection) {
    this.setState({ selection });
    this.props.actions.openConfirmReservationModal();
  }

  render() {
    const {
      filteredResourceTypes,
      isAdmin,
      isFetchingResources,
      resourcesByPurpose,
      t,
      resourceTypes,
    } = this.props;
    console.log(resourcesByPurpose);
    return (
      <PageWrapper className="admin-resources-page" title={t('AdminResourcesPage.title')}>
        <h1>{t('AdminResourcesPage.title')}</h1>
        <Loader loaded={Boolean(!isFetchingResources || Object.keys(resourcesByPurpose).length)}>
          {isAdmin && (
            <div>
              <ResourceTypeFilter
                filteredResourceTypes={filteredResourceTypes}
                onFilterResourceType={this.props.actions.filterAdminResourceType}
                onUnfilterResourceType={this.props.actions.unfilterAdminResourceType}
                resourceTypes={resourceTypes}
              />
              <AvailabilityView
                date={this.props.date}
                groups={resourcesByPurpose}
                onDateChange={this.props.actions.changeAdminResourcesPageDate}
                onSelect={this.handleSelect}
              />
            </div>
          )}
          {isAdmin && !Object.keys(resourcesByPurpose) && <p>{t('AdminResourcesPage.noResourcesMessage')}</p>}
          {!isAdmin && (
            <p>{t('AdminResourcesPage.noRightsMessage')}</p>
          )}
        </Loader>
        {this.state.selection &&
          <ReservationConfirmationContainer
            params={{ id: this.state.selection.resourceId }}
            selectedReservations={[{
              begin: this.state.selection.begin,
              end: this.state.selection.end,
              resource: this.state.selection.resourceId,
            }]}
          />}
        <ReservationSuccessModal />
      </PageWrapper>
    );
  }
}

UnconnectedAdminResourcesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  filteredResourceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isFetchingResources: PropTypes.bool.isRequired,
  resourcesByPurpose: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  resourceTypes: PropTypes.array.isRequired,
};

UnconnectedAdminResourcesPage = injectT(UnconnectedAdminResourcesPage);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeAdminResourcesPageDate,
    fetchFavoritedResources,
    fetchPurposes,
    filterAdminResourceType,
    openConfirmReservationModal,
    unfilterAdminResourceType,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedAdminResourcesPage };
export default (
  connect(adminResourcesPageSelector, mapDispatchToProps)(injectT(UnconnectedAdminResourcesPage))
);
