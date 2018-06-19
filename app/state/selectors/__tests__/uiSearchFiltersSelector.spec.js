import { expect } from 'chai';
import MockDate from 'mockdate';

import uiSearchFiltersSelector from 'state/selectors/uiSearchFiltersSelector';

function getState(date = '2015-10-10', start = '08:30') {
  return {
    ui: {
      search: {
        filters: {
          charge: false,
          date,
          distance: '',
          duration: 30,
          end: '23:30',
          page: 1,
          people: '',
          purpose: 'some-purpose',
          search: '',
          start,
          unit: '',
        },
      },
    },
  };
}

describe('Selector: uiSearchFiltersSelector', () => {
  it('returns search filters from the state', () => {
    const state = getState();
    const actual = uiSearchFiltersSelector(state);
    const expected = state.ui.search.filters;

    expect(actual).to.deep.equal(expected);
  });

  it('returns current date as the date filter if date is an empty string in state', () => {
    const state = getState('');
    MockDate.set('2015-12-24T16:07:37Z');
    const actual = uiSearchFiltersSelector(state);
    MockDate.reset();
    const filters = state.ui.search.filters;
    const expected = Object.assign({}, filters, { date: '2015-12-24' });

    expect(actual).to.deep.equal(expected);
  });
});
