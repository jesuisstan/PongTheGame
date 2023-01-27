import { convertTime } from './time';

describe('Time utils', function () {
  describe('convertTime', function () {
    describe('20 seconds and 500 milliseconds', function () {
      it('Should return 20500', function () {
        expect(
          convertTime({
            seconds: 20,
            milliseconds: 500,
          }),
        ).toEqual(20_500);
      });
    });

    describe('Empty object', function () {
      it('Should return 0', function () {
        expect(convertTime({})).toEqual(0);
      });
    });

    describe('Value over unit limit', function () {
      it('Should return 1500', function () {
        expect(convertTime({ milliseconds: 1500 })).toEqual(1_500);
      });
    });

    describe('4 days 6 hours', function () {
      it('Should return 367200000', function () {
        expect(convertTime({ days: 4, hours: 6 })).toEqual(367_200_000);
      });
    });

    describe('-5 minutes', function () {
      it('Should return undefined', function () {
        expect(convertTime({ minutes: -5 })).toBeUndefined();
      });
    });
  });
});
