import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';

import ReservationStateLabel from 'shared/reservation-state-label';
import TimeRange from 'shared/time-range';
import Image from 'utils/fixtures/Image';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import ReservationControls from 'shared/reservation-controls';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import ReservationListItem from './ReservationListItem';

describe('pages/user-reservations/reservation-list/ReservationListItem', () => {
  const props = {
    isAdmin: false,
    isStaff: false,
    reservation: Immutable(Reservation.build()),
    resource: Immutable(Resource.build({
      images: [Image.build()],
      type: { name: 'test_type' },
    })),
    unit: Immutable(Unit.build()),
  };

  let component;

  before(() => {
    component = shallowWithIntl(<ReservationListItem {...props} />);
  });

  describe('rendering', () => {
    it('renders a li element', () => {
      expect(component.is('li')).to.be.true;
    });

    it('displays an image with correct props', () => {
      const image = component.find('.resourceImg');

      expect(image).to.have.length(1);
      expect(image.props().alt).to.equal(props.resource.images[0].caption);
      expect(image.props().src).to.contain(props.resource.images[0].url);
    });

    it('contains a link to resources page', () => {
      const expectedUrl = getResourcePageUrl(props.resource);
      const resourceLink = component.find({ to: expectedUrl });

      expect(resourceLink.length > 0).to.be.true;
    });

    it('displays the name of the resource', () => {
      const expected = props.resource.name;

      expect(component.find('h4').text()).to.contain(expected);
    });

    it('displays the name of the given unit in props', () => {
      const expected = props.unit.name;

      expect(component.find('.unit-name').text()).to.contain(expected);
    });

    it('contains TimeRange component with correct props', () => {
      const timeRange = component.find(TimeRange);
      expect(timeRange).to.have.length(1);
      expect(timeRange.prop('begin')).to.equal(props.reservation.begin);
      expect(timeRange.prop('end')).to.equal(props.reservation.end);
    });

    it('renders ReservationStateLabel component', () => {
      const reservationStateLabel = component.find(ReservationStateLabel);
      expect(reservationStateLabel.length).to.equal(1);
    });

    it('renders ReservationControls component', () => {
      const reservationControls = component.find(ReservationControls);
      expect(reservationControls).to.have.length(1);
    });

    it('passes correct props to ReservationControls component', () => {
      const actualProps = component.find(ReservationControls).props();

      expect(actualProps.isAdmin).to.equal(false);
      expect(actualProps.isStaff).to.equal(false);
      expect(actualProps.reservation).to.equal(props.reservation);
      expect(actualProps.resource).to.equal(props.resource);
    });
  });
});
