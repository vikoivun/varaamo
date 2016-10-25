import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Carousel from 'react-bootstrap/lib/Carousel';
import Immutable from 'seamless-immutable';

import Image from 'utils/fixtures/Image';
import ImageCarousel from './ImageCarousel';

describe('pages/resource/resource-info/ImageCarousel', () => {
  const images = [
    Image.build(),
    Image.build({ caption: null }),
  ];
  const defaultProps = {
    altText: 'Some alt text',
    images: Immutable(images),
  };

  function getWrapper(extraProps) {
    return shallow(<ImageCarousel {...defaultProps} {...extraProps} />);
  }

  describe('Carousel', () => {
    describe('when there are multiple images in the carousel', () => {
      let carousel;

      before(() => {
        carousel = getWrapper().find(Carousel);
      });

      it('is rendered', () => {
        expect(carousel.length).to.equal(1);
      });

      it('has indicators', () => {
        expect(carousel.prop('indicators')).to.equal(true);
      });

      it('has controls', () => {
        expect(carousel.prop('controls')).to.equal(true);
      });
    });

    describe('when there is only one image in the carousel', () => {
      let carousel;

      before(() => {
        carousel = getWrapper({ images: [Image.build()] }).find(Carousel);
      });

      it('is rendered', () => {
        expect(carousel.length).to.equal(1);
      });

      it('the carousel has indicators', () => {
        expect(carousel.prop('indicators')).to.equal(false);
      });

      it('the carousel has controls', () => {
        expect(carousel.prop('controls')).to.equal(false);
      });
    });
  });

  describe('Carousel items', () => {
    it('renders a Carousel.Item for each image in props', () => {
      const carouselItems = getWrapper().find(Carousel.Item);
      expect(carouselItems.length).to.equal(defaultProps.images.length);
    });

    describe('div for image', () => {
      it('exists for each item', () => {
        const carouselItems = getWrapper().find(Carousel.Item);
        carouselItems.forEach((carouselItem) => {
          const imageDiv = carouselItem.find('div');

          expect(imageDiv.length).to.equal(1);
        });
      });

      it('has correct src', () => {
        const carouselItems = getWrapper().find(Carousel.Item);
        carouselItems.forEach((carouselItem, index) => {
          const imageDiv = carouselItem.find('div');

          expect(imageDiv.prop('style').backgroundImage).to.contain(defaultProps.images[index].url);
        });
      });
    });
  });
});
